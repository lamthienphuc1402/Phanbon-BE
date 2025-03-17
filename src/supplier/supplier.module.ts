import { forwardRef, Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierSchema } from './schema/supplier.schema';
import { ConfigModule } from '@nestjs/config';
import { GenerateModule } from 'src/generate/generate.module';
import { ProductsModule } from 'src/products/products.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    forwardRef(() => WarehouseModule),
    GenerateModule,
    AdminModule,
    MongooseModule.forFeature([{ name: 'Supplier', schema: SupplierSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, AbilityFactory],
  exports: [SupplierService],
})
export class SupplierModule {}
