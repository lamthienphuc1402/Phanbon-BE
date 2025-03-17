import {
  Controller,
  Get,
  UseGuards,
  Req,
  Put,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  HttpCode,
  Param,
  Post,
  HttpException,
  HttpStatus,
  Query,
  Search,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CategoryService } from './category.service';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { createCategoryDto, updateCategoryDto } from './dto/categories.dto';
import { Category } from './schema/categories.schema';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  //tạo category mới
  @Subject('category')
  @Action('create')
  @UseGuards(PermissionGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createCategoryController(
    @Body() dto: createCategoryDto,
  ): Promise<any> {
    try {
      return await this.categoryService.createCategoryService(dto);
    } catch (error) {
      // Xử lý lỗi, có thể tùy chỉnh thông điệp lỗi tùy theo yêu cầu
      if (error.code === 11000) { // Duplicate key error (trường hợp unique constraint bị vi phạm)
        throw new BadRequestException('Category already exists');
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to create category');
    }
  }

  // Cập nhật category
  @Subject('category')
  @Action('update')
  @UseGuards(PermissionGuard)
  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async updateCategoryController(
    @Param('id') id: string,
    @Body() dto: updateCategoryDto,
  ): Promise<any> {
    try {
      return await this.categoryService.updateCategoryService(id, dto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException
      }
      if (error.code === 11000) { // Duplicate key error
        throw new BadRequestException('Category with the same name already exists.');
      }
      console.error(error);
      throw new BadRequestException('Failed to update category');
    }
  }

  // Xóa category
  @Subject('category')
  @Action('delete')
  @UseGuards(PermissionGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async deleteCategoryController(
    @Param('id') id: string,
  ): Promise<Category> {
    try {
      return await this.categoryService.deleteCategoryService(id);
    } catch (error) {
      throw new BadRequestException('Failed to delete category');
    }
  }
  

  //tìm kiếm category
  @Subject('category')
  @Action('read')
  @UseGuards(PermissionGuard)
  @Get('search')
  @ApiConsumes('search name cate')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async searchCategoryController(
    @Query('searchKey') searchKey: string
  ): Promise<{ message: string; categories: Category[] }> {
    try {
      const result = await this.categoryService.searchCategoryService(searchKey);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error occurred while searching categories.');
    }
  }

  @Subject('category')
  @Action('read')
  @UseGuards(PermissionGuard)
  @Get()
  async getAllCategories(): Promise<{ message: string; categories: Category[] }> {
    try {
      const categories = await this.categoryService.getAllCategories();

      if (categories.length === 0) {
        return { message: 'No categories found', categories: [] };
      }

      return { message: `Found ${categories.length} category(ies)`, categories };
    } catch (error) {
      throw new NotFoundException('Error retrieving categories');
    }
  }

  //xem chi tiết category
  @Subject('category')
  @Action('read')
  @UseGuards(PermissionGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'The record has been successfully retrieved.',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async detailCategoryController(
    @Param('id') id: string
  ): Promise<Category> {
    try {
      return await this.categoryService.detailCategoryService(id);
    } catch (error) {
      throw new NotFoundException('Category not found');
    }
  }
  
}


