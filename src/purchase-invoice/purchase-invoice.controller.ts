import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePurchaseInvoiceDto, updatePurchaseInvoiceDto } from './dto/purchaseInvoice.dto';
import { PurchaseInvoice } from './schema/purchaseInvoice.schema';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Purchase Invoice')
@ApiBearerAuth()
@Controller('purchase-invoice')
export class PurchaseInvoiceController {
  constructor(private readonly purchaseInvoiceService: PurchaseInvoiceService) {}

  // thêm hóa đơn mua hàng
  @Action('create')
  @Subject('purchaseInvoice')
  @UseGuards(PermissionGuard)
  @Post()
  async addPurchaseInvoiceController(@Body() dto: CreatePurchaseInvoiceDto): Promise<any> {
    return await this.purchaseInvoiceService.addPurchaseInvoiceService(dto);
  }


  // lấy tất cả hóa đơn mua hàng
  @Action('read')
  @Subject('purchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get()
  async getAllPurchaseInvoiceController(): Promise<PurchaseInvoice[]> {
    return await this.purchaseInvoiceService.getAllPurchaseInvoiceLeanService();
  }

  // xem chi tiết hóa đơn mua hàng theo id
  @Action('read')
  @Subject('purchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get(':id/detail')
  async getPurchaseInvoiceByIdController(@Param('id') id: string): Promise<PurchaseInvoice> {
    return await this.purchaseInvoiceService.getPurchaseInvoiceByIdService(id);
  }

}
