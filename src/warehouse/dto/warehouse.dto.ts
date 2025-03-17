import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum, IsNumber } from "class-validator";

export class CreateWarehouseDto {

    @ApiProperty({
        description: 'Name warehouse',
        example: 'Kho 1'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    wareHouseName: string;

    @ApiProperty({
        description: 'productId ID associated with the product',
        example: '60d21bb67c1b2c001f6472d4',
    })
    @IsMongoId()
    @IsOptional()
    productId: string;

    @ApiProperty({
        description: 'Description warehouse',
        example: 'Abcdsa',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    describeWareHouse: string;

    @ApiProperty({
        description: 'Minimum product quantity',
        example: 0
    })
    @IsNumber()
    @IsOptional()
    quantityMin: number;

    @ApiProperty({
        description: 'Maximum number of products',
        example: 1000
    })
    @IsNumber()
    @IsOptional()
    quantityMax: number;

    @ApiProperty({
        description: 'Current product quantity',
        example: 0
    })
    @IsNumber()
    @IsOptional()
    quantityNow: number;

    @ApiProperty({
        description: 'Status',
        example: 'show'
    })
    @IsString()
    @IsOptional()
    @IsEnum(['show', 'hidden'])
    status: string;
}


export class importWarehouseDto {

    @ApiProperty({
        description: 'production date',
        example: new Date('2021-06-23T00:00:00.000Z')
    })
    @IsDate()
    @IsOptional()
    productionDate: Date;

    @ApiProperty({
        description: 'expiry of product',
        example: new Date('2024-06-23T00:00:00.000Z')
    })
    @IsDate()
    @IsOptional()
    expiry: Date;

    @ApiProperty({
        description: 'purchase invoice Id',
        example: '60d21bb67c1b2c001f6472d4'
    })
    @IsMongoId()
    @IsOptional()
    purchaseInvoiceId: string;
}