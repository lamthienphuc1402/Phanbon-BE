import { Module } from '@nestjs/common';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { PurchaseInvoiceController } from './purchase-invoice.controller';
import { SupplierModule } from 'src/supplier/supplier.module';
import { GenerateModule } from 'src/generate/generate.module';
import { ProductsModule } from 'src/products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PurchaseInvoice,
  PurchaseInvoiceSchema,
} from './schema/purchaseInvoice.schema';
import { Supplier, SupplierSchema } from 'src/supplier/schema/supplier.schema';
import { Products, ProductsSchema } from 'src/products/schema/products.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    SupplierModule,
    GenerateModule,
    AdminModule,
    ProductsModule,
    MongooseModule.forFeature([
      { name: PurchaseInvoice.name, schema: PurchaseInvoiceSchema },
      { name: 'Supplier', schema: SupplierSchema },
      { name: Products.name, schema: ProductsSchema },
    ]),
  ],
  controllers: [PurchaseInvoiceController],
  providers: [PurchaseInvoiceService, AbilityFactory],
  exports: [PurchaseInvoiceService],
})
export class PurchaseInvoiceModule {}
