import { forwardRef, Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { GenerateModule } from 'src/generate/generate.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WareHouse, WareHouseSchema } from './schema/warehouse.schema';
import { ProductsModule } from 'src/products/products.module';
import { AdminModule } from 'src/admin/admin.module';
import { CategoryModule } from 'src/categories/category.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    AdminModule,
    forwardRef(() => CategoryModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => SupplierModule),
    MongooseModule.forFeature([{ name: WareHouse.name, schema: WareHouseSchema }]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService, AbilityFactory],
  exports: [WarehouseService],
})
export class WarehouseModule {}
