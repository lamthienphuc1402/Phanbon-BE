import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum, IsNumber, IsEmail, Length, IsArray, ArrayMinSize, ValidateNested, IsDateString } from "class-validator";


class SalesProductDto {

    @IsMongoId()
    productId: string;

    @IsNumber()
    quantityProduct: number;

}


export class addSalesinvoiceDto {
    @ApiProperty({
        description: 'User ID registered',
        example: '66c6ffc65a1d764184575e59',
    })
    @IsMongoId()
    userId: string;

    // @IsNumber()
    // sumPrice: number;
    // @IsNumber()
    // sumBill: number;

    @Type(() => SalesProductDto)
    @IsArray({ always: true })
    @IsOptional({ always: true })
    @ArrayMinSize(1, { always: true })
    @ValidateNested({ always: true })
    saleProduct: SalesProductDto[];

    @IsString()
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    statusSalesInvoice: string;
}

export class updateSalesinvoiceDto {

    @ApiProperty({
        description: 'Status',
        example: 'active',
        required: false,
    })
    @IsString()
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    statusSalesInvoice: string;
}

export class FindSalesInvoiceDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    page?: number = 1;

    @ApiProperty({ required: false, default: 10 })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    limit?: number = 10;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ required: false, enum: ['active', 'inactive'] })
    @IsOptional()
    @IsEnum(['active', 'inactive'])
    statusSalesInvoice?: string;
}