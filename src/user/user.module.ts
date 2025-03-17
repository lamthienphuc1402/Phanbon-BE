import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProductsModule } from 'src/products/products.module';
import { WarehouseModule } from 'src/warehouse/warehouse.module';
import { GenerateModule } from 'src/generate/generate.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserSchema } from './schema/user.schema';
import { SalesinvoiceModule } from 'src/salesinvoice/salesinvoice.module';
import { SalesinvoiceSchema } from 'src/salesinvoice/schema/salesinvoice.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    forwardRef(() => SalesinvoiceModule),
    forwardRef(() => ProductsModule),
    forwardRef(() => WarehouseModule),
    AdminModule,
    GenerateModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{ name: 'Saleinvoice', schema: SalesinvoiceSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [UserService, AbilityFactory],
  controllers: [UserController]
})
export class UserModule {}
