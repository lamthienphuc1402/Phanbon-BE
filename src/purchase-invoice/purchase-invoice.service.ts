import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PurchaseInvoice } from './schema/purchaseInvoice.schema';
import { GenerateService } from 'src/generate/generate.service';
import { Model, Types } from 'mongoose';
import {
  CreatePurchaseInvoiceDto,
  updatePurchaseInvoiceDto,
} from './dto/purchaseInvoice.dto';
import { Supplier } from 'src/supplier/schema/supplier.schema';
import { Products } from 'src/products/schema/products.schema';

@Injectable()
export class PurchaseInvoiceService {
  constructor(
    @InjectModel(PurchaseInvoice.name)
    private purchaseInvoiceModel: Model<PurchaseInvoice>,
    @InjectModel(Supplier.name) private supplierModel: Model<Supplier>,
    @InjectModel('Products') private productsModel: Model<Products>,
    private readonly generateService: GenerateService,
  ) {}

  // thêm hóa đơn mua hàng
  async addPurchaseInvoiceService(
    data: CreatePurchaseInvoiceDto,
  ): Promise<PurchaseInvoice> {
    // Kiểm tra xem nhà cung cấp có tồn tại không
    const checkSupplier = await this.supplierModel
      .findById(data.supplierId)
      .lean();
    if (!checkSupplier) {
      throw new BadRequestException('Supplier not found');
    }

    // Lấy danh sách productId từ dữ liệu đầu vào
    const productIds = data.purchaseProducts.map(
      (product) => product.productId,
    );

    // Kiểm tra xem có sản phẩm nào bị trùng lặp không
    const uniqueProductIds = [...new Set(productIds)];
    if (uniqueProductIds.length !== productIds.length) {
      throw new BadRequestException('One or more products are duplicated');
    }

    // Kiểm tra xem tất cả sản phẩm có tồn tại trong cơ sở dữ liệu không
    const checkProducts = await this.productsModel
      .find({
        _id: { $in: uniqueProductIds },
      })
      .lean();

    if (checkProducts.length !== uniqueProductIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    // Tính toán tổng số tiền từ dữ liệu đầu vào
    const totalAmount = data.purchaseProducts.reduce((acc, product) => {
      const foundProduct = checkProducts.find(
        (p) => p._id.toString() === product.productId,
      );
      return (
        acc + (foundProduct ? foundProduct.purchasePrice * product.quantity : 0)
      );
    }, 0);

    // kiểm tra status của hóa đơn mua hàng, nếu status là prepay thì bắt buộc phải điền thêm các trường thông tin paidAmount, paymentTems

    if (data.status === 'prepay' && (!data.paidAmount || !data.paymentTems)) {
      if (data.status === 'prepay' && data.paidAmount >= totalAmount) {
        throw new BadRequestException(
          'Paid amount must be less than or equal to total amount',
        );
      } else if (data.status === 'prepay' && data.paidAmount < 0) {
        throw new BadRequestException(
          'Paid amount must be greater than or equal to 0',
        );
      }
      // Tính số tiền còn nợ (amountOwed) của hóa đơn mua hàng bằng cách lấy totalAmount trừ đi paidAmount

      throw new BadRequestException(
        'Paid amount and payment terms are required for prepay purchase invoice',
      );
    }

    if (data.status === 'prepay') {
      let amountOwed = 0;
      amountOwed = totalAmount - data.paidAmount;
      // Tạo hóa đơn mua hàng mới
      const purchaseInvoiceId = await this.generateService.generateId(
        this.purchaseInvoiceModel,
        'purchaseInvoiceId',
        'PI',
      );
      const newPurchaseInvoice = new this.purchaseInvoiceModel({
        ...data,
        amountOwed,
        totalAmount,
        purchaseInvoiceId,
      });
      return await newPurchaseInvoice.save();
    }

    // Tạo hóa đơn mua hàng mới
    const purchaseInvoiceId = await this.generateService.generateId(
      this.purchaseInvoiceModel,
      'purchaseInvoiceId',
      'PI',
    );
    const newPurchaseInvoice = new this.purchaseInvoiceModel({
      ...data,
      totalAmount,
      purchaseInvoiceId,
    });

    return await newPurchaseInvoice.save();
  }

  // Lấy danh sách hóa đơn mua hàng với thông tin supplier đã được populate
  async getPopulatedPurchaseInvoices(): Promise<any[]> {
    try {
      const invoices = await this.purchaseInvoiceModel
        .find({
          status: 'prepay',
          approveStatus: 'approved',
        })
        .populate({
          path: 'supplierId',
          select: 'supplierName supplierId supplierPhone',
        })
        .select({
          approveStatus: 0, // Ẩn trường approveStatus
          status: 0, // Ẩn trường status
          purchaseProducts: 0, // Ẩn trường purchaseProducts
          adminId: 0, // Ẩn trường adminId
        })
        .lean()
        .exec();

      console.log('Fetched invoices:', invoices);
      return invoices;
    } catch (error) {
      console.error('Error fetching populated purchase invoices:', error);
      throw error;
    }
  }

  //xem chi tiết hóa đơn mua hàng theo id
  //chưa lean productName purchasePrice
  async getPurchaseInvoiceByIdService(
    purchaseInvoiceId: string,
  ): Promise<PurchaseInvoice> {
    const purchaseInvoice = await this.purchaseInvoiceModel
      .findOne({ purchaseInvoiceId })
      .populate({
        path: 'supplierId',
        select: 'supplierName supplierId supplierPone',
      })
      .populate({
        path: 'adminId',
        select: 'nameAdmin',
      })
      .populate({
        path: 'purchaseProducts.productId',
        select: 'productName purchasePrice',
      })
      .lean()
      .exec();

    if (!purchaseInvoice) {
      throw new NotFoundException('Purchase Invoice not found');
    }

    return purchaseInvoice;
  }

  //tìm hóa đơn mua hàng theo id
  async findPIByIdService(purchaseInvoiceId: string): Promise<PurchaseInvoice> {
    const purchaseInvoice = await this.purchaseInvoiceModel
      .findById(purchaseInvoiceId)
      .exec();
    if (!purchaseInvoice) {
      throw new NotFoundException('Product not found');
    }
    return purchaseInvoice;
  }

  //lấy danh sách tất cả hóa đơn mua hàng
  async getAllPurchaseInvoiceLeanService(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceModel.find().populate({
      path: 'supplierId',
      select: 'supplierName supplierId',
    })    
    .lean().exec();
  }

  //lấy danh sách hóa đơn mua hàng theo trạng thái approveStatus = pending
  async getAllApprovePurchaseInvoiceService(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceModel
      .find({ approveStatus: 'pending' }).populate({
        path: 'supplierId',
        select: 'supplierName supplierId',
      })
      .select({
        purchaseProducts: 0, // Ẩn trường purchaseProducts
        adminId: 0, // Ẩn trường adminId
      })
      .lean()
      .exec();
  }

  // cập nhật trạng thái hóa đơn mua hàng
  async updatePurchaseInvoiceStatusService(
    purchaseInvoiceId: string,
    newStatus: string,
  ): Promise<void> {
    const purchaseInvoice = await this.purchaseInvoiceModel.findOne({
      _id: new Types.ObjectId(purchaseInvoiceId),
    });

    if (!purchaseInvoice) {
      throw new BadRequestException('Purchase invoice not found');
    }

    await this.purchaseInvoiceModel.updateOne(
      { _id: new Types.ObjectId(purchaseInvoiceId) },
      { $set: { approveStatus: newStatus } },
    );
  }

  //update hóa đơn mua hàng
  async updatePurchaseInvoiceService(
    purchaseInvoiceId: string,
    data: updatePurchaseInvoiceDto,
  ): Promise<PurchaseInvoice> {
    const purchaseInvoice = await this.purchaseInvoiceModel
      .findById(purchaseInvoiceId)
      .exec();

    if (!purchaseInvoice) {
      throw new NotFoundException('Purchase Invoice not found');
    }

    // Check if the status is 'prepay'
    if (purchaseInvoice.status !== 'prepay') {
      throw new BadRequestException(
        'Only purchase invoices with status "prepay" can be updated',
      );
    }

    //lấy paidAmount từ hóa đơn mua hàng cộng thêm số tiền đã trả mới
    const newPaidAmount = purchaseInvoice.paidAmount + data.payExtra;

    //kiểm tra xem số tiền đã trả mới có bằng tổng số tiền (totalAmount) không
    if (newPaidAmount > purchaseInvoice.totalAmount) {
      throw new BadRequestException(
        'Paid amount must be less than total amount',
      );
    } else if (newPaidAmount <= purchaseInvoice.totalAmount) {
      //tính số tiền còn nợ (amountOwed) của hóa đơn mua hàng bằng cách lấy totalAmount trừ đi paidAmount
      data.amountOwed = purchaseInvoice.totalAmount - newPaidAmount;
      data.paidAmount = newPaidAmount;
    } else if (data.amountOwed === 0) {
      data.status = 'payed';
    } else {
      throw new InternalServerErrorException('Something went wrong');
    }

    

    //cập nhật hóa đơn mua hàng, câp nhật paidAmount, amountOwed, status
    return await this.purchaseInvoiceModel
      .findByIdAndUpdate(purchaseInvoiceId, data, { new: true })
      .exec();
  }

  //lọc hóa đơn mua hàng theo trạng thái approveStatus = approved
  async filterPurchaseInvoiceByApproveStatusService(
    approveStatus: string,
  ): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceModel
      .find({ approveStatus }).populate({
        path: 'supplierId',
        select: 'supplierName supplierId',
      })
      .select({
        purchaseProducts: 0, // Ẩn trường purchaseProducts
        adminId: 0, // Ẩn trường adminId
        status: 0, // Ẩn trường status
      })
      .lean()
      .exec();
  }

  //lọc hóa đơn mua hàng theo trạng thái approveStatus = rejected
  async filterPurchaseInvoiceByApproveStatusRejectedService(
    approveStatus: string,
  ): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceModel
      .find({ approveStatus }).populate({
        path: 'supplierId',
        select: 'supplierName supplierId',
      })
      .select({
        purchaseProducts: 0, // Ẩn trường purchaseProducts
        adminId: 0, // Ẩn trường adminId
        status: 0, // Ẩn trường status
      })
      .lean()
      .exec();
  }

  //lấy danh sách hóa đơn mua hàng theo ngày
  async findAllBetweenDates(
    startDate: Date,
    endDate: Date,
  ): Promise<PurchaseInvoice[]> {
    return this.purchaseInvoiceModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
  }

  async findAll(): Promise<PurchaseInvoice[]> {
    return this.purchaseInvoiceModel.find().exec();
  }
}
