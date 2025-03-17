import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Products } from './schema/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { addProductDto, updateProductDto } from './dto/products.dto';
import { CategoryService } from 'src/categories/category.service';
import { GenerateService } from 'src/generate/generate.service';
import { WarehouseService } from 'src/warehouse/warehouse.service';


@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(Products.name) private productModel: Model<Products>,
        @Inject(forwardRef(() => WarehouseService ))
        private readonly warehouseService: WarehouseService, // Sử dụng dịch vụ WarehouseService
        @Inject(forwardRef(() => CategoryService ))
        private readonly categoryService: CategoryService,// Sử dụng dịch vụ CategoryService
        @Inject(forwardRef(() => GenerateService ))
        private readonly generateService: GenerateService, // Sử dụng dịch vụ GenerateService // Sử dụng dịch vụ WarehouseService
    ) { }


    //thêm sản phẩm mới
    async addProductService(data: addProductDto): Promise<Products> {

        // Kiểm tra xem danh mục sản phẩm có tồn tại không trước khi cập nhật
        const categoryExists = await this.categoryService.findCategoryByIdService(data.categoryId);
        if (!categoryExists) {
            throw new BadRequestException('Category not found');
        }

        // Kiểm tra xem tên sản phẩm đã tồn tại trong danh mục chưa
        const productExists = await this.productModel.findOne({ categoryId: data.categoryId, productName: data.productName });
        if (productExists) {
            throw new BadRequestException('Product name already exists in this category');
        }

        // Tạo sản phẩm mới
        const newProduct = new this.productModel({
            ...data,
        });
        newProduct.productId = await this.generateService.generateId(this.productModel, 'productId', 'P');
        try {
            return await newProduct.save();
        } catch (error) {
            if (error.code === 11000) { // Duplicate key error (trường hợp unique constraint bị vi phạm)
                throw new BadRequestException('Product already exists');
            }
            // throw new InternalServerErrorException('Failed to create product'); // Lỗi chung
        }
    }

    // cập nhật Product
    async updateProductService(id: string, data: updateProductDto): Promise<Products> {
        // Kiểm tra xem Product có tồn tại không 
        const existingProduct = await this.productModel.findById(id).exec();
        if (!existingProduct) {
            throw new NotFoundException('Product not found');
        }

        // Kiểm tra xem danh mục sản phẩm có tồn tại không trước khi cập nhật
        if (data.categoryId) {
            const categoryExists = await this.categoryService.findCategoryByIdService(data.categoryId);
            if (!categoryExists) {
                throw new BadRequestException('Category not found');
            }
        }

        // Thực hiện cập nhật sản phẩm
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true }
        ).exec();

        if (!updatedProduct) {
            throw new InternalServerErrorException('Failed to update product');
        }
        return updatedProduct;
    }

    // xem chi tiết sản phẩm
    async getDetailProductByIdService(id: string): Promise<any> {
        // Tìm sản phẩm theo ID
        const existingProduct = await this.productModel.findById(id).exec();

        // Kiểm tra xem sản phẩm có tồn tại không
        if (!existingProduct) {
            throw new Error('Product not found'); // Ném lỗi chung khi không tìm thấy sản phẩm
        }

        // Nếu sản phẩm tồn tại, lấy chi tiết sản phẩm và populate categoryId, SupplierId
        return await this.productModel.findById(id)
        .populate(
            {
                path: 'categoryId', 
                select: 'categoryName categoryId', // Chỉ lấy các trường categoryName và categoryId
            }
        )
    }

    // xem danh sách sản phẩm
    async getAllProductsService(): Promise<any[]> {
        return await this.productModel.find().populate('categoryId').exec();
    }

    // phân trang sản phẩm
    async paginationProductService(page: number, limit: number): Promise<any> {
        const skip = (page - 1) * limit;
        const totalProducts = await this.productModel.countDocuments();
        const products = await this.productModel.find().skip(skip).limit(limit).exec();
        return {
            totalProducts,
            products
        };
    }

    // xóa sản phẩm
    async deleteProductService(id: string): Promise<{ message: string }> {
        const existingProduct = await this.productModel.findById(id).exec();

        // Kiểm tra xem sản phẩm có tồn tại không
        if (!existingProduct) {
            throw new Error('Product not found'); // Ném lỗi chung khi không tìm thấy sản phẩm
        }

        // Kiểm tra xem sản phẩm có tồn tại trong kho không
        const warehouseWithProduct = await this.warehouseService.getAllWarehouseService();
        const isProductInWarehouse = warehouseWithProduct.some(warehouse =>
            warehouse.productId.toString() === id
        );
        if (isProductInWarehouse) {
            throw new BadRequestException('Cannot delete product because it exists in a warehouse');
        }
        
        // Nếu sản phẩm tồn tại, xóa sản phẩm
        const deletedProduct = await this.productModel.findByIdAndDelete(id).lean().exec();
        if (!deletedProduct) {
            throw new InternalServerErrorException('Failed to delete product');
        }
        return { message: 'Product deleted successfully' };
    }
 
    // tìm kiếm sản phẩm 
    async searchProductService(searchKey: string): Promise<{ message: string; products: Products[] }> {
        const normalizedSearchKey = searchKey
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const regex = new RegExp(normalizedSearchKey.split(' ').join('|'), 'i');

        try {
            const allProducts = await this.productModel.find().exec();
            const matchingProducts = allProducts.filter((product) => {
                const preprocessedProductName = product.productName
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                return regex.test(preprocessedProductName);
            });

            return { message: matchingProducts.length > 0 ? `Found ${matchingProducts.length} product(s)` : 'No product found', products: matchingProducts };

        } catch (error) {
            console.error('Error occurred while searching products:', error);
            throw new InternalServerErrorException('aaaaaaaaaaa');
        }
    }
    


    // lọc sản phẩm theo danh mục
    async filterProductByCategoryService(
        categoryId: string,
    ): Promise<any[]> {
        const query: any = {};

        if (categoryId) query.categoryId = categoryId;

        const products = await this.productModel.find(query).populate('categoryId').exec();
        if (products.length === 0) {
            throw new NotFoundException('No product found');
        }
        return products;
    }

    // lọc sản phẩm theo giá mua trong khoảng giá từ - đến
    async filterProductByPurchasePriceService(
        minPrice: number,
        maxPrice: number,
    ): Promise<any[]> {
        const query: any = {};
    
        if (minPrice != null && maxPrice != null) {
            query.purchasePrice = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice != null) {
            query.purchasePrice = { $gte: minPrice };
        } else if (maxPrice != null) {
            query.purchasePrice = { $lte: maxPrice };
        }
    
        const products = await this.productModel.find(query).exec();
    
        if (products.length === 0) {
            throw new NotFoundException('No product found');
        }
    
        return products;
    }

    // lọc sản phẩm theo giá bán trong khoảng giá từ - đến
    async filterProductBySalePriceService(
        minPrice: number,
        maxPrice: number,
    ): Promise<any[]> {
        const query: any = {};
    
        if (minPrice != null && maxPrice != null) {
            query.purchasePrice = { $gte: minPrice, $lte: maxPrice };
        } else if (minPrice != null) {
            query.purchasePrice = { $gte: minPrice };
        } else if (maxPrice != null) {
            query.purchasePrice = { $lte: maxPrice };
        }
    
        const products = await this.productModel.find(query).exec();
    
        if (products.length === 0) {
            throw new NotFoundException('No product found');
        }
    
        return products;
    }

    // lọc sản phẩm theo ngày tạo từ - đến
    async filterProductByCreatedDateService(
        fromDate: Date,
        toDate: Date,
    ): Promise<any[]> {
        const query: any = {};
    
        if (fromDate != null && toDate != null) {
            query.createdAt = { $gte: fromDate, $lte: toDate };
        } else if (fromDate != null) {
            query.createdAt = { $gte: fromDate };
        } else if (toDate != null) {
            query.createdAt = { $lte: toDate };
        }
    
        const products = await this.productModel.find(query).exec();
    
        if (products.length === 0) {
            throw new NotFoundException('No product found');
        }
    
        return products;
    }

    //xem sản phẩm theo categoryId
    async getProductByCategoryIdService(categoryId: string): Promise<Products[]> {
        return this.productModel.find({ categoryId }).exec();
    }
    

    // find product by id
    async findProductByIdService(productId: string): Promise<Products> {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new NotFoundException('Product not found');
        }
        return product;
    }

    async findManyByIds(ids: string[]): Promise<Products[]> {
        return this.productModel.find({ _id: { $in: ids } }).exec();
    }

}
