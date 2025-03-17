import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEmail,
  IsEnum,
  IsNumber,
  Length,
  IsObject,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseInvoiceDto {
  
  @ApiProperty({
    description: 'Category ID associated with the product',
    example: '60d21bb67c1b2c001f6472d4',
  })
  @IsMongoId()
  @IsOptional()
  categoryId: string;

  @ApiProperty({
    description: 'Supplier ID associated with the purchase invoice',
    example: '60d21bb67c1b2c001f6472d4',
  })
  @IsMongoId()
  @IsOptional()
  supplierId: string;

  @ApiProperty({
    description: 'Admin ID associated with the purchase invoice',
    example: '66d5da30e5dd7c9cd9cd1208',
  })
  @IsMongoId()
  @IsOptional()
  adminId: string;

  @ApiProperty({
    description: 'List of purchased products',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: { type: 'string', example: '60d21bb67c1b2c001f6472d4' },
        quantity: { type: 'number', example: 10 },
      },
    },
    example: [
      {
        productId: '60d21bb67c1b2c001f6472d4',
        quantity: 10,
      },
    ],
  })
  @IsArray()
  @Type(() => Object) // Chỉ định rằng các phần tử trong mảng là đối tượng
  purchaseProducts: { productId: string; quantity: number }[];

  @ApiProperty({
    description: 'Status of purchase invoice',
    example: 'payed',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['payed', 'prepay'])
  status: string;
  
  @ApiProperty({
    description: 'Amount paid for the purchase invoice',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  paidAmount: number;

  @ApiProperty({
    description: 'Amount paid for the purchase invoice',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  amountOwed: number;

  @ApiProperty({
    description: 'Loan term of purchase invoice',
    example: '30',
  })
  @IsNumber()
  @IsOptional()
  paymentTems: number;
  
  @ApiProperty({
    description: 'Approve status of purchase invoice',
    example: 'pending',
  })
  @IsString()
  @IsOptional()
  @IsEnum(['approved', 'rejected', 'pending'])
  approveStatus: string;
}


export class updatePurchaseInvoiceDto {
  @ApiProperty({
    description: 'Status of purchase invoice',
    example: 'prepay',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(['payed', 'prepay'])
  status: string;

  @ApiProperty({
    description: 'Amount paid for the purchase invoice',
    example: '0',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  paidAmount: number;

  @ApiProperty({
    description: 'Amount paid for the purchase invoice',
    example: '0',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  amountOwed: number;

  @ApiProperty({
    description: 'pay extra for the purchase invoice',
    example: '5',
  })
  @IsNumber()
  @IsOptional()
  payExtra: number;

}