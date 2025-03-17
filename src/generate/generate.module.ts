import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [GenerateService],
  exports: [GenerateService],
})
export class GenerateModule {}
