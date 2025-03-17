import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RevenueReport, ProductReport } from './schema/revenue-report.schema';
import { SaleInvoiceService } from '../salesinvoice/saleinvoice.service';
import { ProductsService } from '../products/products.service';
import Big from 'big.js';
import { RevenueReportResponseDto, ProductReportDto } from './dto/revenue-report.dto';

@Injectable()
export class RevenueReportService {
  constructor(
    @InjectModel(RevenueReport.name) private revenueReportModel: Model<RevenueReport>,
    private readonly saleInvoiceService: SaleInvoiceService,
    private readonly productService: ProductsService,
  ) {}

  async generateDailyReport(date: Date): Promise<RevenueReportResponseDto> {
    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    // Kiểm tra xem đã có báo cáo cho ngày này chưa
    let existingReport = await this.revenueReportModel.findOne({ date: startOfDay });

    const salesInvoices = await this.saleInvoiceService.findAllBetweenDates(startOfDay, endOfDay);

    if (!Array.isArray(salesInvoices)) {
      throw new Error('Dữ liệu trả về từ dịch vụ hóa đơn không hợp lệ');
    }

    const productReports = await this.generateProductReports(salesInvoices);

    const totalSales = new Big(productReports.reduce((sum, report) => sum + report.totalSales, 0));
    const totalPurchases = new Big(productReports.reduce((sum, report) => sum + report.totalPurchases, 0));
    const totalRevenue = totalSales.minus(totalPurchases);
    const totalOrders = salesInvoices.length;
    const averageOrderValue = totalOrders > 0 
      ? this.roundToTwoDecimals(totalSales.div(totalOrders).toNumber())
      : 0;

    const reportData = {
      date: startOfDay,
      totalRevenue: this.roundToTwoDecimals(totalRevenue.toNumber()),
      totalSales: this.roundToTwoDecimals(totalSales.toNumber()),
      totalPurchases: this.roundToTwoDecimals(totalPurchases.toNumber()),
      totalOrders,
      averageOrderValue,
      productReports,
    };

    let savedReport;

    if (existingReport) {
      // Nếu báo cáo đã tồn tại, cập nhật nó
      savedReport = await this.revenueReportModel.findOneAndUpdate(
        { _id: existingReport._id },
        reportData,
        { new: true, runValidators: true }
      );
    } else {
      // Nếu báo cáo chưa tồn tại, tạo mới
      const newReport = new this.revenueReportModel(reportData);
      savedReport = await newReport.save();
    }

    if (!savedReport) {
      throw new Error('Không thể lưu hoặc cập nhật báo cáo');
    }

    return this.mapToRevenueReportResponseDto(savedReport);
  }

  private async generateProductReports(salesInvoices): Promise<ProductReport[]> {
    const productMap = new Map();

    for (const invoice of salesInvoices) {
      if (Array.isArray(invoice.saleProduct)) {
        for (const item of invoice.saleProduct) {
          const productId = item.productId.toString();
          let product = productMap.get(productId);
          if (!product) {
            product = {
              productId: productId,
              productName: 'Unknown Product',
              totalRevenue: 0,
              totalSales: 0,
              totalPurchases: 0,
              totalOrders: 0,
              quantitySold: 0,
            };
            productMap.set(productId, product);
          }
          const saleAmount = Number(item.sumPrice) || 0;
          product.totalSales += saleAmount;
          product.totalOrders++;
          product.quantitySold += Number(item.quantityProduct) || 0;
        }
      } else {
        console.warn(`Invoice ${invoice._id} does not have a valid saleProduct array`);
      }
    }

    // Lấy thông tin chi tiết của sản phẩm
    const productIds = Array.from(productMap.keys());
    const productDetails = await this.productService.findManyByIds(productIds);

    for (const product of productDetails) {
      const reportProduct = productMap.get(product._id.toString());
      if (reportProduct) {
        reportProduct.productName = product.productName;
        // Nếu totalSales là 0, sử dụng giá bán của sản phẩm
        if (reportProduct.totalSales === 0) {
          reportProduct.totalSales = (product.salePice || 0) * reportProduct.quantitySold;
        }
        const purchaseAmount = new Big(product.purchasePrice || 0).times(reportProduct.quantitySold).toNumber();
        reportProduct.totalPurchases = purchaseAmount;
        reportProduct.totalRevenue = reportProduct.totalSales - purchaseAmount;
        reportProduct.averageOrderValue = reportProduct.totalOrders > 0 
          ? reportProduct.totalSales / reportProduct.totalOrders 
          : 0;
      }
    }

    return Array.from(productMap.values());
  }

  private mapToRevenueReportResponseDto(report: RevenueReport): RevenueReportResponseDto {
    return {
      date: report.date.toISOString(),
      totalRevenue: this.roundToTwoDecimals(report.totalRevenue),
      totalSales: this.roundToTwoDecimals(report.totalSales),
      totalPurchases: this.roundToTwoDecimals(report.totalPurchases),
      totalOrders: report.totalOrders,
      averageOrderValue: this.roundToTwoDecimals(report.averageOrderValue),
      productReports: report.productReports.map(pr => ({
        productId: pr.productId,
        productName: pr.productName,
        totalRevenue: this.roundToTwoDecimals(pr.totalRevenue),
        totalSales: this.roundToTwoDecimals(pr.totalSales),
        totalPurchases: this.roundToTwoDecimals(pr.totalPurchases),
        totalOrders: pr.totalOrders,
        averageOrderValue: this.roundToTwoDecimals(pr.averageOrderValue),
        quantitySold: pr.quantitySold,
      })),
    };
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  async getReportByDateRange(startDate: Date, endDate: Date): Promise<{ reports: RevenueReportResponseDto[], summary: any }> {
    const reports: RevenueReportResponseDto[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      try {
        const report = await this.generateDailyReport(currentDate);
        reports.push(report);
      } catch (error) {
        console.error(`Lỗi khi tạo báo cáo cho ngày ${currentDate.toISOString()}: ${error.message}`);
      }

      // Chuyển sang ngày tiếp theo
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (!reports.length) {
      throw new NotFoundException('Không thể tạo hoặc cập nhật báo cáo trong khoảng thời gian này');
    }

    const summary = this.calculateSummary(reports);

    return { reports, summary };
  }

  private calculateSummary(reports: RevenueReportResponseDto[]): any {
    const summary = {
      totalRevenue: 0,
      totalSales: 0,
      totalPurchases: 0,
      totalOrders: 0,
      averageOrderValue: 0,
    };

    reports.forEach(report => {
      summary.totalRevenue += report.totalRevenue;
      summary.totalSales += report.totalSales;
      summary.totalPurchases += report.totalPurchases;
      summary.totalOrders += report.totalOrders;
    });

    summary.averageOrderValue = summary.totalOrders > 0 
      ? this.roundToTwoDecimals(summary.totalSales / summary.totalOrders)
      : 0;

    // Làm tròn các giá trị tổng hợp
    summary.totalRevenue = this.roundToTwoDecimals(summary.totalRevenue);
    summary.totalSales = this.roundToTwoDecimals(summary.totalSales);
    summary.totalPurchases = this.roundToTwoDecimals(summary.totalPurchases);

    return summary;
  }
}
