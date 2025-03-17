import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supplier } from './schema/supplier.schema';
import { Model, Types } from 'mongoose';
import { GenerateService } from 'src/generate/generate.service';
import { addSupplierDto, updateSupplierDto } from './dto/supplier.dto';
import { ProductsService } from 'src/products/products.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';

@Injectable()
export class SupplierService {
    constructor(
        @InjectModel('Supplier') private supplierModel: Model<Supplier>,
        private readonly generateService: GenerateService,
        @Inject(forwardRef(() => ProductsService))
        private readonly productService: ProductsService,
        @Inject(forwardRef(() => WarehouseService))
        private readonly warehouseService: WarehouseService,
    ) { }

    //tạo nhà cung cấp mới
    async createSupplierService({ supplierName, supplierPhone, supplierEmail, ...rest }: addSupplierDto): Promise<Supplier> {
        // Check for existing supplier with the same name, phone, or email
        const existingSupplier = await this.supplierModel.findOne({
            $or: [
                { supplierName },
                { supplierPhone },
                { supplierEmail }
            ]
        });

        if (existingSupplier) {
            throw new BadRequestException('Supplier with this name, phone, or email already exists');
        }

        const newSupplier = new this.supplierModel({
            supplierName,
            supplierPhone,
            supplierEmail,
            ...rest,
        });
        newSupplier.supplierId = await this.generateService.generateId(this.supplierModel, 'supplierId', 'S');
        return await newSupplier.save();
}

    //update nhà cung cấp
    async updateSupplierService(supplierId: string, { supplierName, supplierPhone, supplierEmail, ...rest }: updateSupplierDto): Promise<Supplier> {
        // Check if the supplier exists
        const existingSupplier = await this.supplierModel.findById(supplierId);
        if (!existingSupplier) {
          throw new BadRequestException('Supplier not found');
        }
    
        // Check for existing supplier with the same name, phone, or email (excluding the current supplier)
        const duplicateSupplier = await this.supplierModel.findOne({
          _id: { $ne: supplierId },
          $or: [
            { supplierName },
            { supplierPhone },
            { supplierEmail }
          ]
        });
    
        if (duplicateSupplier) {
          throw new BadRequestException('Another supplier with this name, phone, or email already exists');
        }
    
        // Check for duplicate product IDs
        const uniqueProductIds = [...new Set(rest.listProductId)];
        if (uniqueProductIds.length !== rest.listProductId.length) {
          throw new BadRequestException('Duplicate product IDs are not allowed');
        }
    
        // Check if products exist
        await Promise.all(
          uniqueProductIds.map(async (productId) => {
            const product = await this.productService.findProductByIdService(productId);
            if (!product) {
              throw new BadRequestException(`Product with ID ${productId} not found`);
            }
          })
        );
    
        console.log('rest:', rest);
    
        // Update supplier details
        existingSupplier.supplierName = supplierName;
        existingSupplier.supplierPhone = supplierPhone;
        existingSupplier.supplierEmail = supplierEmail;
        Object.assign(existingSupplier, rest);
    
        return await existingSupplier.save();
      }

    //lấy tất cả nhà cung cấp
    async getAllSupplierService(): Promise<any[]> {
        try {
            return await this.supplierModel.find()
                .select('supplierId supplierName supplierPhone supplierEmail supplierStatus')
                .exec();
        } catch (error) {
            console.error('Error occurred while retrieving suppliers:', error);
            throw new InternalServerErrorException('Failed to retrieve suppliers');
        }
    }

    //lấy chi tiết nhà cung cấp theo ID
    async getDetailSupplierByIdService(id: string): Promise<Supplier> {
        const existingSupplier = await this.supplierModel.findById(id).exec();
        if (!existingSupplier) {
            throw new BadRequestException('Supplier not found');
        }
        return existingSupplier;
    }

    //phân trang nhà cung cấp
    async paginationProductService(page: number, limit: number): Promise<any> {
        const skip = (page - 1) * limit;
        const totalSuppliers = await this.supplierModel.countDocuments();
        const suppliers = await this.supplierModel.find().skip(skip).limit(limit).exec();
        return {
            totalSuppliers,
            suppliers
        };
    }

    //xóa nhà cung cấp
    async deleteSupplierService(id: string): Promise<{ message: string }> {
        const existingSupplier = await this.supplierModel.findById(id).exec();
        if (!existingSupplier) {
            throw new BadRequestException('Supplier not found');
        }
        // Check if the supplier has any associated products
        if (existingSupplier.listProductId.length > 0) {
            throw new BadRequestException('Supplier has associated products');
        }
        
        await this.supplierModel.findByIdAndDelete(id).exec();
        return { message: 'Delete supplier successfully' };
    }

    //tìm kiếm nhà cung cấp theo id
    async findSupplierByIdService(id: string): Promise<Supplier> {
        const supplier = await this.supplierModel.findById(id).exec();
        if (!supplier) {
            throw new NotFoundException('Supplier not found');
        }
        return supplier;
    }

    //tìm kiếm nhà cung cấp 
    async searchSupplierService(searchKey: string): Promise<{ message: string; suppliers: Supplier[] }> {
        const normalizedSearchKey = searchKey
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const regex = new RegExp(normalizedSearchKey.split(' ').join('|'), 'i');
        try {
            const allSuppliers = await this.supplierModel.find().exec();
            const matchingSuppliers = allSuppliers.filter((supplier) => {
                const preprocessedSupplierName = supplier.supplierName
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                const preprocessedSupplierId = supplier.supplierId
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                return regex.test(preprocessedSupplierName) || regex.test(preprocessedSupplierId);
            });

            return { message: matchingSuppliers.length > 0 ? `Found ${matchingSuppliers.length} supplier(s)` : 'No supplier found', suppliers: matchingSuppliers };

        } catch (error) {
            console.error('Error occurred while searching products:', error);
            throw new InternalServerErrorException('aaaaaaaaaaa');
        }
    }

    //cap nhat danh sach san pham cua nha cung cap
    async updateSupplierProducts(supplierId: string, productIds: string[]): Promise<void> {
        try {
          const supplierObjectId = new Types.ObjectId(supplierId);
          const productObjectIds = productIds.map(id => new Types.ObjectId(id));
          // const productObjectId = new Types.ObjectId(productId);
    
          // Remove any existing instances of the productId
          await this.supplierModel.findByIdAndUpdate(
            supplierObjectId,
            { $pull: { listProductId: productObjectIds } }
          ).exec();
    
          // Add the new productId using $addToSet to avoid duplicates
          await this.supplierModel.findByIdAndUpdate(
            supplierObjectId,
            { $addToSet: { listProductId: { $each: productObjectIds } } }
          ).exec();
        } catch (error) {
          console.error('Failed to update supplier products:', error);
          throw new Error('Unable to update supplier products');
        }
      }

    // async updateSupplierProducts(supplierId: string, productId: string): Promise<void> {
    //     try {
    //       const supplierObjectId = new Types.ObjectId(supplierId);
    //       const productObjectId = new Types.ObjectId(productId);
    
    //       await this.supplierModel.findByIdAndUpdate(
    //         supplierObjectId,
    //         { $addToSet: { listProductId: productObjectId } }
    //       ).exec();
    //     } catch (error) {
    //       console.error('Failed to update supplier products:', error);
    //       throw new Error('Unable to update supplier products');
    //     }
    //   }

}

