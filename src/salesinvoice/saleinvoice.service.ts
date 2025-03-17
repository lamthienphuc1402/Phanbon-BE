import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Salesinvoice, SalesProducts, } from "./schema/salesinvoice.schema";
import { addSalesinvoiceDto, updateSalesinvoiceDto } from "./dto/salesinvoice.dto";
import { GenerateService } from "src/generate/generate.service";
import { Products } from "src/products/schema/products.schema";
import { WareHouse } from "src/warehouse/schema/warehouse.schema";
import { User } from "src/user/schema/user.schema";

//Dùng để populate, nếu muốn lấy thêm trường dữ liệu gì cứ thêm ở select
 const populatedItems = [{ 
    path: 'saleProduct',
    populate: {
      path: 'productId',
      model: 'Products',
      select: "productName salePice"
    } 
 }, {
    path: "userId",
    model: "User",
    select: "userName userId userPhone"
 }]

@Injectable()
export class SaleInvoiceService {
    private readonly logger = new Logger(SaleInvoiceService.name);
    constructor(
        @InjectModel(Salesinvoice.name) private saleInvoiceModel: Model<Salesinvoice>,
        @InjectModel(Products.name) private productModel: Model<Products>,
        @InjectModel(WareHouse.name) private wareHouseModel: Model<WareHouse>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly generateService: GenerateService,
       
    ) { }
    
    //get all bill
    async getAllSaleInvoice(): Promise<Salesinvoice[]> {
        const invoices = await this.saleInvoiceModel.find().populate(populatedItems).exec()
    
        return invoices;
    }

    //thêm bill mới
    async addSaleInvoice(data: addSalesinvoiceDto): Promise<Salesinvoice> {
        const newSaleInvoice = new this.saleInvoiceModel({ ...data });
     
        newSaleInvoice.salesInvoiceId = await this.generateService.generateId(this.saleInvoiceModel, 'salesInvoiceId', 'S');
        
        let totalBill = 0;
        
        // Xử lý từng sản phẩm trong hóa đơn
        for (const product of newSaleInvoice.saleProduct) {
            const foundProduct = await this.productModel.findById(product.productId);
            if (!foundProduct) {
                throw new NotFoundException(`Product with id ${product.productId} not found`);
            }
            
            const foundWareHouse = await this.wareHouseModel.findOne({
                productId: product.productId
            });
            if (!foundWareHouse) {
                throw new NotFoundException(`Warehouse entry for product ${product.productId} not found`);
            }
            
            const quantity = Number(product.quantityProduct);
            if (foundWareHouse.quantityNow < quantity) {   
                throw new BadRequestException(`Product ${foundProduct.productName} has less quantity than the order`);
            }
            
            // Tính sumPrice cho sản phẩm
            const price = Number(foundProduct.salePice);
            const sumPrice = quantity * price;
            product.sumPrice = sumPrice;
            totalBill += sumPrice;
            
            // Cập nhật số lượng trong kho
            const remainingProducts = foundWareHouse.quantityNow - quantity;
            await this.wareHouseModel.findOneAndUpdate({productId: product.productId}, {quantityNow: remainingProducts});
        }
        
        newSaleInvoice.sumBill = totalBill;

        try {
            const resultSaleInvoice = await newSaleInvoice.save();
     
            await this.userModel.findByIdAndUpdate(resultSaleInvoice.userId, {$push: {listSaleinvoice: resultSaleInvoice._id}});
            return resultSaleInvoice;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('Failed to create sale invoice'); // Lỗi chung
        }
    }
    //update hdon
    async updateSaleInvoice(id: string, data: updateSalesinvoiceDto): Promise<Salesinvoice> {
        const existingsaleinvoice = await this.saleInvoiceModel.findById(id).exec();
        if (!existingsaleinvoice) {
            throw new BadRequestException('Saleinvoice not found');
        }

        // Check for existing saleinvoice with the same name, phone, or email
        const updateSaleInvoice = await this.saleInvoiceModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).exec();

        if (!updateSaleInvoice) {
            throw new BadRequestException('Failed to update saleinvoice');
        }
        return updateSaleInvoice;
    }
    //tìm kiếm hdon theo id
    async findSaleInvoiceByIdService(id: string): Promise<Salesinvoice> {
        const saleinvoice = await this.saleInvoiceModel.findById(id).populate(populatedItems).exec();
        if (!saleinvoice) {
            throw new NotFoundException('Saleinvoice not found');
        }
        return saleinvoice;
    }
    //lấy chi tiết hdon theo ID
    async getDetailSaleinvoiceByIdService(id: string): Promise<Salesinvoice> {
        const existingsaleinvoice = await this.saleInvoiceModel.findById(id).populate(populatedItems).exec();
        if (!existingsaleinvoice) {
            throw new BadRequestException('Saleinvoice not found');
        }
        return existingsaleinvoice;
    }
    //tìm kiếm hdon 
    async searchSaleinvoieService(searchKey: string): Promise<{ message: string; saleinvoices: Salesinvoice[] }> {
        
         // Create a regex pattern based on user input
         const regexPattern = new RegExp(searchKey, 'i'); // 'i' for case-insensitive
        try {
            const allSaleinvoices = await this.saleInvoiceModel.find({salesInvoiceId: { $regex: regexPattern}}).populate(populatedItems).exec();
           
            console.log("check")
            console.log(allSaleinvoices)
            return { message: "Found", saleinvoices: allSaleinvoices };

        } catch (error) {
            console.error('Error occurred while searching products:', error);
            throw new InternalServerErrorException('aaaaaaaaaaa');
        }
    }

    async getSalesInvoicesByDateRange(startDate: Date, endDate: Date): Promise<Salesinvoice[]> {
        return this.saleInvoiceModel.find({
            createdAt: { $gte: startDate, $lte: endDate },
            statusSalesInvoice: 'active',
        }).exec();
    }

    async findAllBetweenDates(startDate: Date, endDate: Date): Promise<Salesinvoice[]> {
        return this.saleInvoiceModel.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).populate({
            path: 'saleProduct.productId',
            select: 'productName salePice purchasePrice'
        }).exec();
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
        startDate?: Date,
        endDate?: Date,
        statusSalesInvoice?: string
      ): Promise<{ salesInvoices: Salesinvoice[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const query: any = {};
    
        if (startDate && endDate) {
          query.createdAt = {
            $gte: startDate,
            $lte: endDate
          };
        }
    
        if (statusSalesInvoice) {
          query.statusSalesInvoice = statusSalesInvoice;
        }
    
        this.logger.debug(`Query: ${JSON.stringify(query)}`);
    
        const [salesInvoices, total] = await Promise.all([
          this.saleInvoiceModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),
          this.saleInvoiceModel.countDocuments(query)
        ]);
    
        this.logger.debug(`Found ${salesInvoices.length} invoices`);
    
        return {
          salesInvoices,
          total,
          page,
          limit
        };
    }
}