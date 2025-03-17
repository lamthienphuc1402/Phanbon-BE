import { Module } from '@nestjs/common';
import { HistoryWareHouseService } from './history-ware-house.service';
import { HistoryWareHouseController } from './history-ware-house.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoryS, HistorySchema } from './schema/history.schema';
import { PurchaseInvoiceModule } from 'src/purchase-invoice/purchase-invoice.module';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';


@Module({
  imports: [
    AdminModule,
    PurchaseInvoiceModule,
    MongooseModule.forFeature([{ name: HistoryS.name, schema: HistorySchema }]),
  ],
  controllers: [HistoryWareHouseController],
  providers: [HistoryWareHouseService, AbilityFactory],
  exports: [HistoryWareHouseService],
})
export class HistoryWareHouseModule {}
