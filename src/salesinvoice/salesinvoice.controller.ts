import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Logger, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { addSalesinvoiceDto, updateSalesinvoiceDto } from './dto/salesinvoice.dto';
import { SaleInvoiceService } from './saleinvoice.service';
import { Salesinvoice } from './schema/salesinvoice.schema';
import { FindSalesInvoiceDto } from './dto/salesinvoice.dto';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';
import { Action, Subject } from 'src/decorator/casl.decorator';

@ApiTags('salesinvoice')
@ApiBearerAuth()
@Controller('salesinvoice')
export class SalesinvoiceController {
  private readonly logger = new Logger(SalesinvoiceController.name);
  constructor(private readonly salesInvoiceService: SaleInvoiceService) { }

  @Action('read')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  @Get()
  async getAllProduct(): Promise<{ message: string; invoices: Salesinvoice[] }> {
    try {
      // Gọi dịch vụ để lấy tất cả các danh mục
      const invoices = await this.salesInvoiceService.getAllSaleInvoice();

      if (invoices.length === 0) {
        // Nếu không có danh mục nào, trả về thông báo cùng danh sách rỗng
        return {
          message: 'Product is emty',
          invoices: []
        };
      }

      // Nếu có danh mục, trả về danh sách cùng thông báo thành công
      return {
        message: 'Danh sách các invoices',
        invoices
      };
    } catch (error) {
      // Xử lý lỗi không xác định
      console.error(error);
      throw new InternalServerErrorException('Failed to retrieve categories');
    }
  }

  // thêm hoa don moi
  @Action('create')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  @Post("create")
  @ApiOperation({ summary: 'Add a new sale invoice' })
  // @ApiResponse({ status: 201, description: 'The sale invoice has been successfully created.', type: SaleInvoice })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSaleInvoiceController(
    @Body() dto: addSalesinvoiceDto,
  ): Promise<any> {
    try {
      return await this.salesInvoiceService.addSaleInvoice(dto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error occurred in add sale invoice controller:', error);
      throw new InternalServerErrorException('Failed to add sale invoice');
    }
  }
  // cập nhật nhà cung cấp
  @Action('update')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update saleinvoice' })
  @ApiResponse({ status: 200, description: 'The saleinvoice has been successfully updated.', type: Salesinvoice })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateSaleInvoiceController(
      @Param('id') id: string,
      @Body() dto: updateSalesinvoiceDto,
  ): Promise<any> {
      try {
          return await this.salesInvoiceService.updateSaleInvoice(id, dto);
      } catch (error) {
          if (error instanceof BadRequestException) {
              throw error;
          }
          console.error('Error occurred in updateSaleinvoice controller:', error);
          throw new InternalServerErrorException('Failed to update saleinvoice');
      }
  }
  //lấy chi tiết nhà cung cấp
  @Action('read')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get saleinvoice detail' })
  @ApiResponse({ status: 200, description: 'Return saleinvoice detail.', type: Salesinvoice })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getDetailSaleinvoiceController(
      @Param('id') id: string,
  ): Promise<Salesinvoice> {
      try {
          return await this.salesInvoiceService.getDetailSaleinvoiceByIdService(id);
      } catch (error) {
          if (error instanceof BadRequestException) {
              throw error;
          }
          console.error('Error occurred in getDetailSaleinvoice controller:', error);
          throw new InternalServerErrorException('Failed to get saleinvoice detail');
      }
  }
  //tìm kiếm nhà cung cấp
  @Action('read')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  @Get('/search/:searchKey')
  @ApiOperation({ summary: 'Search saleinvoice' })
  @ApiResponse({ status: 200, description: 'Return saleinvoice.', type: Salesinvoice })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async searchSaleinvoiceController(
      @Param('searchKey') searchKey: string): Promise<{message: string; saleinvoices: Salesinvoice[]}> {
        console.log(searchKey)
      try {
          const result = await this.salesInvoiceService.searchSaleinvoieService(searchKey);
          return result;
      } catch (error) {
          if (error instanceof BadRequestException) {
              throw error;
          }
          console.error('Error occurred in searchSaleinvoice controller:', error);
          throw new InternalServerErrorException('Failed to search saleinvoice');
      }
  }

  @Action('read')
  @Subject('salesinvoice')
  @UseGuards(PermissionGuard)
  //bug
  @Post('/filter')
  @ApiOperation({ summary: 'Get all sales invoices with filters' })
  @ApiResponse({ status: 200, description: 'Return all sales invoices.' })
  async findAll(@Query() findSalesInvoiceDto: FindSalesInvoiceDto) {
    this.logger.debug(`Received DTO: ${JSON.stringify(findSalesInvoiceDto)}`);

    const { page, limit, startDate, endDate, statusSalesInvoice } = findSalesInvoiceDto;
    const startDateTime = startDate ? new Date(startDate) : undefined;
    const endDateTime = endDate ? new Date(endDate) : undefined;

    return this.salesInvoiceService.findAll(
      page,
      limit,
      startDateTime,
      endDateTime,
      statusSalesInvoice
    );
  }
}
