import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
  IsArray,
  IsDataURI,
} from 'class-validator';

export class PayableDto {

  @ApiProperty({
    description: 'purchase invoice id',
    example: '612f3e5e5f3b3b001f3b3b3b',
  })
  @IsMongoId()
  @IsNotEmpty()
  purchaseInvoiceId: string;

}
