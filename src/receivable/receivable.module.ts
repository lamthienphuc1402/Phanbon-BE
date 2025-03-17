import { Module } from '@nestjs/common';
import { ReceivableService } from './receivable.service';
import { ReceivableController } from './receivable.controller';
import { GenerateModule } from 'src/generate/generate.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Salesinvoice, SalesinvoiceSchema } from 'src/salesinvoice/schema/salesinvoice.schema';
import { Receivable, ReceivableSchema } from './schema/receivable.schema';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { AdminModule } from 'src/admin/admin.module';
import { AbilityFactory } from 'src/abilities/abilities.factory';

@Module({
  imports: [
    AdminModule,
    GenerateModule,
    MongooseModule.forFeature([{ name: Salesinvoice.name, schema: SalesinvoiceSchema }, {name: Receivable.name, schema: ReceivableSchema}, {name: User.name, schema: UserSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [ReceivableService, AbilityFactory],
  controllers: [ReceivableController]
})
export class ReceivableModule {}
