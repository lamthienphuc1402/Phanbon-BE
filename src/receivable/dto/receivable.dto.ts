import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum, IsNumber, IsEmail, Length, IsArray, ArrayMinSize, ValidateNested } from "class-validator";

export class addReceivableDto {
    @IsMongoId()
    salesInvoiceId: string;
    @ApiProperty({
        description: 'User ID registered',
        example: '66c6ffc65a1d764184575e59',
    })
    @IsMongoId()
    userId: string;
    @IsString()
    @IsOptional()
    @IsEnum(['30 days', '60 days', '90 days'])
    paymentTerm: string;
    @IsNumber()
    paid: number;
}

export class updateReceivableDto {
    @ApiProperty({
        description: 'paymentTerm',
        example: '30 days',
        required: true,
    })
    @IsString()
    @IsOptional()
    @IsEnum(['30 days', '60 days', '90 days'])
    paymentTerm: string;
    @IsNumber()
    paid: number;
}