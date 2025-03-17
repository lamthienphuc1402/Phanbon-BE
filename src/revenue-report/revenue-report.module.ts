import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RevenueReportController } from './revenue-report.controller';
import { RevenueReportService } from './revenue-report.service';
import { RevenueReport, RevenueReportSchema } from './schema/revenue-report.schema';
import { SalesinvoiceModule, SaleInvoiceService } from '../salesinvoice';
import { ConfigModule } from '@nestjs/config';
import { Salesinvoice, SalesinvoiceSchema } from 'src/salesinvoice/schema/salesinvoice.schema';
import { ProductsModule } from '../products/products.module';
import { Products, ProductsSchema } from '../products/schema/products.schema';
import { WarehouseModule } from '../warehouse/warehouse.module'; // Thêm dòng này
import { WareHouse, WareHouseSchema } from '../warehouse/schema/warehouse.schema'; // Thêm dòng này
import { UserModule } from '../user/user.module'; // Thêm dòng này
import { User, UserSchema } from '../user/schema/user.schema'; // Thêm dòng này
import { GenerateService } from '../generate/generate.service'; // Thêm dòng này
// Thêm dòng này
import { AbilityFactory } from '../abilities/abilities.factory'; // Thêm dòng này
import { AdminModule } from 'src/admin/admin.module';
import { PurchaseInvoiceModule } from '../purchase-invoice/purchase-invoice.module'; // Thêm dòng này

@Module({
  imports: [
    PurchaseInvoiceModule,
    AdminModule,
    SalesinvoiceModule,
    ProductsModule,
    WarehouseModule, // Thêm dòng này
    UserModule, // Thêm dòng này
    MongooseModule.forFeature([
      { name: RevenueReport.name, schema: RevenueReportSchema },
      { name: Salesinvoice.name, schema: SalesinvoiceSchema },
      { name: Products.name, schema: ProductsSchema },
      { name: WareHouse.name, schema: WareHouseSchema }, // Thêm dòng này
      { name: User.name, schema: UserSchema }, // Thêm dòng này
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [RevenueReportController],
  providers: [
    RevenueReportService,
    SaleInvoiceService,
    GenerateService, // Thêm GenerateService vào đây
    AbilityFactory, // Thêm dòng này
  ],
  exports: [RevenueReportService],
})
export class RevenueReportModule {}

