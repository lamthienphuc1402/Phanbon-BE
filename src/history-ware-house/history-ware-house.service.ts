import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApprovePurchaseInvoiceService } from 'src/approve-purchase-invoice/approve-purchase-invoice.service';
import { PurchaseInvoiceService } from 'src/purchase-invoice/purchase-invoice.service';
import { HistoryDto } from './dto/history.dto';
import { HistoryS } from './schema/history.schema';

@Injectable()
export class HistoryWareHouseService {
    constructor(
        @InjectModel(HistoryS.name)
        private historyModel: Model<HistoryS>,
        private readonly purchaseInvoiceService: PurchaseInvoiceService,
    ) {}

    // thêm lịch sử nhập kho
    async addHistory(historyDto: HistoryDto): Promise<HistoryS> {
        const newHistory = new this.historyModel(historyDto);
        return await newHistory.save();
    }

    // lấy lịch sử nhập kho
    async getHistory(): Promise<HistoryS[]> {
        return await this.historyModel.find().exec();
    }

    // chưa tối ưu
    // lấy lịch sử nhập kho theo id, hiển thị chi tiết thông tin hóa đơn mua hàng bằng cách populate purchaseInvoiceId
    async getHistoryById(id: string): Promise<HistoryS> {
        return await this.historyModel
          .findById(id)
          .populate(
            {
                path: 'purchaseInvoiceId',
                select: 'purchaseInvoiceId supplierId adminId purchaseProducts',
            }
          )
      }

}
