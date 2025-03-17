import { Module } from '@nestjs/common';
import { ApprovePurchaseInvoiceService } from './approve-purchase-invoice.service';
import { ApprovePurchaseInvoiceController } from './approve-purchase-invoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Approve, ApproveSchema } from './schema/approve.schema';
import { PurchaseInvoiceModule } from 'src/purchase-invoice/purchase-invoice.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { HistoryWareHouseModule } from 'src/history-ware-house/history-ware-house.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    HistoryWareHouseModule,
    WarehouseModule,
    SupplierModule,
    AdminModule,
    PurchaseInvoiceModule,
    MongooseModule.forFeature([{ name: Approve.name, schema: ApproveSchema }]),
  ],
  controllers: [ApprovePurchaseInvoiceController],
  providers: [ApprovePurchaseInvoiceService, AbilityFactory],
  exports: [ApprovePurchaseInvoiceService],
})
export class ApprovePurchaseInvoiceModule {}
