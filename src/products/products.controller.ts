
import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { addProductDto, updateProductDto } from './dto/products.dto';
import { Products } from './schema/products.schema';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // thêm sản phẩm mới
  @Action('create')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Post()
  async addProductController(@Body() dto: addProductDto): Promise<any> {
    return await this.productsService.addProductService(dto);
  }

  // update sản phẩm
  @Action('update')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Put(':id')
  @ApiOkResponse({
    description: 'The record has been successfully updated',
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async updateProductController(
    @Param('id') id: string,
    @Body() dto: updateProductDto,
  ): Promise<any> {
    try {
      return await this.productsService.updateProductService(id, dto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      console.error(error);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  // Lấy tất cả sản phẩm
  @Action('read')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Get()
  async getAllProduct(): Promise<{ message: string; products: Products[] }> {
    try {
      // Gọi dịch vụ để lấy tất cả các danh mục
      const products = await this.productsService.getAllProductsService();

      if (products.length === 0) {
        // Nếu không có danh mục nào, trả về thông báo cùng danh sách rỗng
        return {
          message: 'Product is emty',
          products: []
        };
      }

      // Nếu có danh mục, trả về danh sách cùng thông báo thành công
      return {
        message: 'Danh sách các products',
        products
      };
    } catch (error) {
      // Xử lý lỗi không xác định
      console.error(error);
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  // Xóa sản phẩm
  @Action('delete')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Delete(':id')
  @ApiOkResponse({ description: 'Product successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Product not found.' })
  @ApiInternalServerErrorResponse({ description: 'Failed to delete product.' })
  async deleteProductController(@Param('id') id: string): Promise<any> {
      return await this.productsService.deleteProductService(id);
  }


  // tìm kiếm sản phẩm theo tên hoặc mã sản phẩm
  @Action('read')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Get('search')
  @ApiConsumes('search name cate')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async searchProductController(@Query('searchKey') searchKey: string): Promise<{ message: string; products: Products[] }> {
  
    try {
      const result = await this.productsService.searchProductService(searchKey);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to search product');
    }
  }

  //lọc sản phẩm theo danh mục
  @Action('read')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Get('filterCategory')
  async filterProductController(@Query('filter') filter: string): Promise<any> {
    try {
      return await this.productsService.filterProductByCategoryService(filter);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error occurred in filterProduct controller:', error);
      throw new InternalServerErrorException('Failed to filter product by category');
    }
  }


  //lọc sản phẩm theo giá mua
  @Action('read')
  @Subject('product')
  @UseGuards(PermissionGuard)
  @Get('filterPurchasePrice')
  async filterProductByPurchasePriceController(
    @Query('minPrice') minPrice: number,
    @Query('maxPrice') maxPrice: number
  ): Promise<any> {
      return await this.productsService.filterProductByPurchasePriceService(minPrice, maxPrice);
  }

    //lọc sản phẩm theo giá bán
    @Action('read')
    @Subject('product')
    @UseGuards(PermissionGuard)
    @Get('filterSalePrice')
    async filterProductBySalePriceController(
      @Query('minPrice') minPrice: number,
      @Query('maxPrice') maxPrice: number
    ): Promise<any> {
        return await this.productsService.filterProductBySalePriceService(minPrice, maxPrice);
    }

    //lọc sản phẩm theo ngày tạo
    @Action('read')
    @Subject('product')
    @UseGuards(PermissionGuard)
    @Get('filterCreateDate')
    async filterProductByCreateDateController(
      @Query('fromDate') fromDate: Date,
      @Query('toDate') toDate: Date
    ): Promise<any> {
        return await this.productsService.filterProductByCreatedDateService(fromDate, toDate);
    }

    // Lấy chi tiết sản phẩm
    @Action('read')
    @Subject('product')
    @UseGuards(PermissionGuard)
    @Get(':id')
    async getDetailProductController(@Param('id') id: string): Promise<any> {
      try {
        // Gọi dịch vụ để lấy chi tiết sản phẩm
        return await this.productsService.getDetailProductByIdService(id);
      } catch (error) {
        if (error.message === 'Product not found') {
          // Trả lại lỗi BadRequestException cho trường hợp sản phẩm không tồn tại
          throw new BadRequestException('Product not found');
        }
        console.error(error);
        // Trả lại lỗi InternalServerErrorException cho các lỗi không xác định
        throw new InternalServerErrorException('Failed to retrieve product details');
      }
    }

    

}
