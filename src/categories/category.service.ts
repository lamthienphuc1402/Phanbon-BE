import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schema/categories.schema';
import { createCategoryDto } from './dto/categories.dto';
import { ProductsService } from 'src/products/products.service';



@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<Category>,
        @Inject(forwardRef(() => ProductsService))
        private readonly productService: ProductsService,
    ) { }

    // Tìm category theo id
    async findCategoryByIdService(id: string): Promise<Category> {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        return category;
    }

    // tạo category mới
    async createCategoryService(data: createCategoryDto): Promise<Category> {
        // Tạo category mới
        const newCategory = new this.categoryModel({
            ...data,
        });
        // Lưu category vào cơ sở dữ liệu
        return await newCategory.save();
    }

    // cập nhật category
    async updateCategoryService(id: string, data: createCategoryDto): Promise<Category> {

        // Kiểm tra xem category có tồn tại không
        const existingCategory = await this.categoryModel.findById(id).exec();
        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }
        // Cập nhật tài liệu và trả về phiên bản mới
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(
            id,
            data,
            { new: true, runValidators: true } // `new: true` đảm bảo trả về tài liệu đã cập nhật
        ).exec();

        // Kiểm tra xem tài liệu đã được cập nhật hay chưa
        if (!updatedCategory) {
            throw new NotFoundException('Category not update');
        }

        return updatedCategory;
    }

    // Xóa category
    async deleteCategoryService(id: string): Promise<Category> {
        // Kiểm tra xem category có tồn tại không
        const existingCategory = await this.categoryModel.findById(id).exec();
        if (!existingCategory) {
            throw new NotFoundException('Category not found');
        }
        // Kiểm tra xem category có sản phẩm không
        const products = await this.productService.filterProductByCategoryService(id);
        if (products.length > 0) {
            throw new BadRequestException('Category has products, please delete products before deleting category');
        }
        // Xóa category
        return await this.categoryModel.findByIdAndDelete(id).exec();
    }

    //tìm kiếm category
    async searchCategoryService(searchKey: string): Promise<{ message: string; categories: Category[] }> {
        const normalizedSearchKey = searchKey
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const regex = new RegExp(normalizedSearchKey.split(' ').join('|'), 'i');

        try {
            const allCategories = await this.categoryModel.find().exec();
            const matchingCategories = allCategories.filter((category) => {
                const preprocessedCategoryName = category.categoryName
                    .trim()
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                return regex.test(preprocessedCategoryName);
            });

            return { message: matchingCategories.length > 0 ? `Found ${matchingCategories.length} category(ies)` : 'No category found', categories: matchingCategories };

        } catch (error) {
            // Xử lý các lỗi ngoại lệ, chuyển lỗi lên controller để xử lý
            throw new InternalServerErrorException('Error occurred while searching categories.');
        }
    }

    // Phương thức để lấy tất cả danh mục
    async getAllCategories(): Promise<Category[]> {
        return await this.categoryModel.find().exec();
    }

//xem chi tiết category
    async detailCategoryService(id: string): Promise<any> {
        const categoryDetal = await this.productService.getProductByCategoryIdService(id);
        if (!categoryDetal) {
            throw new NotFoundException('Category not found');
        }
        return categoryDetal;
    }
}

export class findIdCategoryService {
}

