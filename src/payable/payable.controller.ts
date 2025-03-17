import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { PayableService } from './payable.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { updatePurchaseInvoiceDto } from 'src/purchase-invoice/dto/purchaseInvoice.dto';
import { Action, Subject } from 'src/decorator/casl.decorator';
import { PermissionGuard } from 'src/gaurd/permission.gaurd';

@ApiTags('Payable')
@ApiBearerAuth()
@Controller('payable')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  //xem danh công nợ phải trả
  @Action('read')
  @Subject('payable')
  @UseGuards(PermissionGuard)
  @Get()
  async getPayable(): Promise<any> {
      return await this.payableService.getPayableService();
  }

  //xem chi tiết công nợ phải trả theo id
  @Action('read')
  @Subject('payable')
  @UseGuards(PermissionGuard)
  @Get(':id')
  async getPayableById(@Param('id')id: string): Promise<any> {
      return await this.payableService.getPayableByIdService(id);
  }

  //update công nợ phải trả
  @Action('update')
  @Subject('payable')
  @UseGuards(PermissionGuard)
  @Put(':id/update')
  async updatePayable(@Param('id') id: string,
  @Body() dto: updatePurchaseInvoiceDto,
): Promise<any> {
      return await this.payableService.exampleMethodToUpdateInvoice(id, dto);
  }


}
 