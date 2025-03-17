import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Approve } from './schema/approve.schema';
import { Model } from 'mongoose';
import { PurchaseInvoiceService } from 'src/purchase-invoice/purchase-invoice.service';
import { approveDto } from './dto/approve.dto';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';
import { SupplierService } from 'src/supplier/supplier.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';
import { GenerateService } from 'src/generate/generate.service';
import { HistoryWareHouseService } from 'src/history-ware-house/history-ware-house.service';

@Injectable()
export class ApprovePurchaseInvoiceService {
  constructor(
    @InjectModel(Approve.name)
    private approvePurchaseInvoiceModule: Model<Approve>,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
    private readonly supplierService: SupplierService,
    private readonly warehouseService: WarehouseService,
    private readonly historyWareHouseService: HistoryWareHouseService,
  ) {}

  //lấy danh sách tất cả hóa đơn mua hàng có trạng thái approveStatus = 'pending'
  async getAllApprovePurchaseInvoiceService(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceService.getAllApprovePurchaseInvoiceService();
  }

  // duyệt hóa đơn mua hàng
  async approvePurchaseInvoiceService(data: approveDto): Promise<Approve> {
    // Kiểm tra xem hóa đơn mua hàng có tồn tại không
    const purchaseInvoice = await this.purchaseInvoiceService.findPIByIdService(
      data.purchaseInvoiceId,
    );

    // Kiểm tra trạng thái hiện tại của hóa đơn mua hàng
    if (purchaseInvoice.approveStatus !== 'pending') {
      throw new BadRequestException('Purchase invoice has been successfully approved');
    }

    // Tạo và lưu tài liệu Approve
    const approve = new this.approvePurchaseInvoiceModule({
      purchaseInvoiceId: purchaseInvoice._id,
      approveStatus: data.approveStatus,
    });

    const savedApprove = await approve.save();

    // Nếu hóa đơn đã được phê duyệt, cập nhật danh sách sản phẩm của nhà cung cấp
    if (data.approveStatus === 'approved') {
      // Lấy supplierId và danh sách productIds từ hóa đơn
      const supplierId = purchaseInvoice.supplierId.toString(); // Đảm bảo supplierId là kiểu string
      const productIds = purchaseInvoice.purchaseProducts.map((product) =>
        product.productId.toString(),
      );

      // Cập nhật danh sách sản phẩm của nhà cung cấp
      await this.supplierService.updateSupplierProducts(supplierId, productIds);

      // cập nhật số lượng sản phẩm trong kho tương ứng với productId
      for (const product of purchaseInvoice.purchaseProducts) {
        const productToUpdate = {
          productId: product.productId.toString(),
          quantity: product.quantity,
        };
        await this.warehouseService.updateProductQuantityService(
          productToUpdate,
        );
      }
      // Cập nhật trạng thái hóa đơn
      await this.purchaseInvoiceService.updatePurchaseInvoiceStatusService(
        data.purchaseInvoiceId,
        'approved',
      );

      // sau khi cập nhật trạng thái hóa đơn hãy lưu lại ngày cập nhật, purchaseInvoiceId đã được cập nhật vào bảng History
      await this.historyWareHouseService.addHistory({
        purchaseInvoiceId: data.purchaseInvoiceId,
        updatedAt: new Date().toISOString(),
      });

      return savedApprove;

    } else if (data.approveStatus === 'rejected') {
      // Nếu hóa đơn bị từ chối, cập nhật trạng thái hóa đơn
      await this.purchaseInvoiceService.updatePurchaseInvoiceStatusService(
        data.purchaseInvoiceId,
        'rejected',
      );

      return savedApprove;
    }
  }

  //xem chi tiết hóa đơn mua hàng theo id
  async getApprovePurchaseInvoiceByIdService(id: string): Promise<any> {
    return await this.purchaseInvoiceService.findPIByIdService(id);
  }

  // Lấy danh sách hóa đơn mua hàng đã được phê duyệt
  async getAllApprovedPurchaseInvoiceApproveService(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceService.filterPurchaseInvoiceByApproveStatusService('approved');
  }

    // Lấy danh sách hóa đơn mua hàng đã từ chối
    async getAllApprovedPurchaseInvoiceRejectedService(): Promise<PurchaseInvoice[]> {
      return await this.purchaseInvoiceService.filterPurchaseInvoiceByApproveStatusRejectedService('rejected');
    }
}
