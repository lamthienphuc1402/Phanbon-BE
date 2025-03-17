import { Module } from '@nestjs/common';
import { PayableService } from './payable.service';
import { PayableController } from './payable.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payable, PayableSchema } from './schema/payable.schema';
import { PurchaseInvoiceModule } from 'src/purchase-invoice/purchase-invoice.module';
import { GenerateModule } from 'src/generate/generate.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    PurchaseInvoiceModule,
    AdminModule,
    GenerateModule,
    MongooseModule.forFeature([{ name: Payable.name, schema: PayableSchema }]),

  ],
  controllers: [PayableController],
  providers: [PayableService, AbilityFactory],
  exports: [PayableService],
})
export class PayableModule {}
