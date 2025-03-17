import { Module } from '@nestjs/common';
import { SaleInvoiceService } from './saleinvoice.service';
import { SalesinvoiceController } from './salesinvoice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Salesinvoice, SalesinvoiceSchema, SalesProducts, SalesProductsSchema } from './schema/salesinvoice.schema';
import { ConfigModule } from '@nestjs/config';
import { GenerateModule } from 'src/generate/generate.module';
import { Products, ProductsSchema } from 'src/products/schema/products.schema';
import { WareHouse, WareHouseSchema } from 'src/warehouse/schema/warehouse.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';
@Module({
  imports: [
    GenerateModule,
    AdminModule,
    MongooseModule.forFeature([{ name: Salesinvoice.name, schema: SalesinvoiceSchema }, {name: Products.name, schema: ProductsSchema}, {name: WareHouse.name, schema: WareHouseSchema},{name: User.name, schema: UserSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [SaleInvoiceService, AbilityFactory],
  controllers: [SalesinvoiceController]
})
export class SalesinvoiceModule {}
