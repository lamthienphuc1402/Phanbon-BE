import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payable } from './schema/payable.schema';
import { Model } from 'mongoose';
import { GenerateService } from 'src/generate/generate.service';
import { PurchaseInvoiceService } from 'src/purchase-invoice/purchase-invoice.service';
import { PurchaseInvoice } from 'src/purchase-invoice/schema/purchaseInvoice.schema';
import { updatePurchaseInvoiceDto } from 'src/purchase-invoice/dto/purchaseInvoice.dto';

@Injectable()
export class PayableService {
  constructor(
    @InjectModel(Payable.name)
    private payableModel: Model<Payable>,
    private readonly generateService: GenerateService,
    private readonly purchaseInvoiceService: PurchaseInvoiceService,
  ) {}

// lấy danh sách tất cả hóa đơn mua hàng, sau đó lọc lại theo status là prepay
    async getPayableService(): Promise<any> {
        const purchaseInvoices = await this.purchaseInvoiceService.getPopulatedPurchaseInvoices();
        return purchaseInvoices;
    }

    //xem chi tiết hóa đơn mua hàng theo id
    async getPayableByIdService(id: string): Promise<any> {
        const purchaseInvoice = await this.purchaseInvoiceService.findPIByIdService(id);
        return purchaseInvoice;
    }

    //update công nợ phải trả
    async exampleMethodToUpdateInvoice(purchaseInvoiceId: string, data: updatePurchaseInvoiceDto): Promise<PurchaseInvoice> {
      return await this.purchaseInvoiceService.updatePurchaseInvoiceService(purchaseInvoiceId, data);
    }
}
