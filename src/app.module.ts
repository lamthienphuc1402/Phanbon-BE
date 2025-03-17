import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './categories/category.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { RoleModule } from './role/role.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { GenerateModule } from './generate/generate.module';
import { SupplierModule } from './supplier/supplier.module';
import { PurchaseInvoiceModule } from './purchase-invoice/purchase-invoice.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { HistoryWareHouseModule } from './history-ware-house/history-ware-house.module';
import { ApprovePurchaseInvoiceModule } from './approve-purchase-invoice/approve-purchase-invoice.module';
import { PayableModule } from './payable/payable.module';
import { ReceivableModule } from './receivable/receivable.module';
import { SalesinvoiceModule } from './salesinvoice/salesinvoice.module';
import { UserModule } from './user/user.module';
import { RevenueReportModule } from './revenue-report/revenue-report.module';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10h' },
    }),
    GenerateModule,
    ProductsModule,
    RoleModule,
    AuthModule,
    CategoryModule,
    AdminModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    SupplierModule,
    PurchaseInvoiceModule,
    WarehouseModule,
    HistoryWareHouseModule,
    ApprovePurchaseInvoiceModule,
    PayableModule,
    ReceivableModule,
    SalesinvoiceModule,
    UserModule,
    RevenueReportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
