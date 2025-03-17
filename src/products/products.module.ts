import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schema/products.schema';
import { CategoryModule } from 'src/categories/category.module';
import { GenerateModule } from 'src/generate/generate.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    forwardRef(() => WarehouseModule),
    GenerateModule,
    AdminModule,
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([{ name: Products.name, schema: ProductsSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, AbilityFactory],
  exports: [ProductsService]
})
export class ProductsModule { }

