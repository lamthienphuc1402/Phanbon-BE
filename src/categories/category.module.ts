import { forwardRef, Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Category, CategorySchema } from './schema/categories.schema';
import { ProductsModule } from 'src/products/products.module';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';


@Module({
  imports: [
    forwardRef(() => ProductsModule),
    AdminModule,
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, AbilityFactory],
  exports: [CategoryService],
})
export class CategoryModule {}
