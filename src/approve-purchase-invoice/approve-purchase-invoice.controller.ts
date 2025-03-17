import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApprovePurchaseInvoiceService } from './approve-purchase-invoice.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { approveDto } from './dto/approve.dto';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Approve Purchase Invoice')
@ApiBearerAuth()
@Controller('approve-purchase-invoice')
export class ApprovePurchaseInvoiceController {
  constructor(private readonly approvePurchaseInvoiceService: ApprovePurchaseInvoiceService) {}

  //lấy danh sách tất cả hóa đơn mua hàng
  @Action('read')
  @Subject('approvePurchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get()
  async getAllApprovePurchaseInvoiceController(): Promise<any> {
    return await this.approvePurchaseInvoiceService.getAllApprovePurchaseInvoiceService();
  }
  
  // duyệt hóa đơn mua hàng
  @Action('approve')
  @Subject('approvePurchaseInvoice')
  @UseGuards(PermissionGuard)
  @Post(':id')
  async approvePurchaseInvoiceController(@Body() dto: approveDto): Promise<any> {
    return await this.approvePurchaseInvoiceService.approvePurchaseInvoiceService(dto);
  }

  //lấy danh sách tất cả hóa đơn mua hàng có trạng thái approveStatus = 'approved'
  @Action('read')
  @Subject('approvePurchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get('approved')
  async getAllApprovedPurchaseInvoiceApproveController(): Promise<any> {
    return await this.approvePurchaseInvoiceService.getAllApprovedPurchaseInvoiceApproveService();
  }

  @Action('read')
  @Subject('approvePurchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get('rejected')
  async getAllApprovedPurchaseInvoiceRejectedController(): Promise<any> {
    return await this.approvePurchaseInvoiceService.getAllApprovedPurchaseInvoiceRejectedService();
  }

  //lấy chi tiết hóa đơn mua hàng
  @Action('read')
  @Subject('approvePurchaseInvoice')
  @UseGuards(PermissionGuard)
  @Get(':id')
  async getPurchaseInvoiceDetailController(@Param('id') id: string): Promise<any> {
    return await this.approvePurchaseInvoiceService.getApprovePurchaseInvoiceByIdService(id);
  }

}
