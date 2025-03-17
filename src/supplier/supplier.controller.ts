import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { dot } from 'node:test/reporters';
import { addSupplierDto, updateSupplierDto } from './dto/supplier.dto';
import { Supplier } from './schema/supplier.schema';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Supplier')
@ApiBearerAuth()
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) { }

  // thêm nhà cung cấp mới
  @Action('create')
  @Subject('supplier')
  @UseGuards(PermissionGuard)
  @Post()
  @ApiOperation({ summary: 'Add a new supplier' })
  // @ApiResponse({ status: 201, description: 'The supplier has been successfully created.', type: Supplier })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSupplierController(
    @Body() dto: addSupplierDto,
  ): Promise<any> {
      return await this.supplierService.createSupplierService(dto);
  }

  // cập nhật nhà cung cấp
  @Action('update')
  @Subject('supplier')
  @UseGuards(PermissionGuard)
    @Put(':id')
    @ApiOperation({ summary: 'Update supplier' })
    @ApiResponse({ status: 200, description: 'The supplier has been successfully updated.', type: Supplier })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async updateSupplierController(
        @Param('id') id: string,
        @Body() dto: updateSupplierDto,
    ): Promise<any> {
            return await this.supplierService.updateSupplierService(id, dto);
    }

    //lấy tất cả nhà cung cấp
    @Action('read')
    @Subject('supplier')
    @UseGuards(PermissionGuard)
    @Get()
    @ApiOperation({ summary: 'Get all suppliers' })
    @ApiResponse({ status: 200, description: 'Return all suppliers.', type: [Supplier] })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getAllSuppliersController(): Promise<Supplier[]> {
        try {
            return await this.supplierService.getAllSupplierService();
        } catch (error) {
            console.error('Error occurred in getAllSuppliers controller:', error);
            throw new InternalServerErrorException('Failed to get suppliers');
        }
    }

    

    // xóa nhà cung cấp
    @Action('delete')
    @Subject('supplier')
    @UseGuards(PermissionGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete supplier' })
    @ApiResponse({ status: 200, description: 'Delete supplier successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async deleteSupplierController(
        @Param('id') id: string,
    ): Promise<{ message: string }> {
        try {
            return await this.supplierService.deleteSupplierService(id);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in deleteSupplier controller:', error);
            throw new InternalServerErrorException('Failed to delete supplier');
        }
    }

    //tìm kiếm nhà cung cấp
    @Action('read')
    @Subject('supplier')
    @UseGuards(PermissionGuard)
    @Get('search')
    @ApiOperation({ summary: 'Search supplier' })
    @ApiResponse({ status: 200, description: 'Return supplier.', type: Supplier })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async searchSupplierController(
        @Query('searchKey') searchKey: string): Promise<{message: string; suppliers: Supplier[]}> {

        try {
            const result = await this.supplierService.searchSupplierService(searchKey);
            return result;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in searchSupplier controller:', error);
            throw new InternalServerErrorException('Failed to search supplier');
        }
    }


    //lấy chi tiết nhà cung cấp
    @Action('read')
    @Subject('supplier')
    @UseGuards(PermissionGuard)
    @Get(':id')
    @ApiOperation({ summary: 'Get supplier detail' })
    @ApiResponse({ status: 200, description: 'Return supplier detail.', type: Supplier })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    async getDetailSupplierController(
        @Param('id') id: string,
    ): Promise<Supplier> {
        try {
            return await this.supplierService.getDetailSupplierByIdService(id);
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            console.error('Error occurred in getDetailSupplier controller:', error);
            throw new InternalServerErrorException('Failed to get supplier detail');
        }
    }
}
