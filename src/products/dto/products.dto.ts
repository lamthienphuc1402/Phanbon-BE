import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum, IsNumber } from "class-validator";

export class addProductDto {

    @ApiProperty({
        description: 'Category ID associated with the product',
        example: '60d21bb67c1b2c001f6472d4',
    })
    @IsMongoId()
    @IsOptional()
    categoryId: string;

    @ApiProperty({
        description: 'Name product',
        example: 'Abc'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    productName: string;

    @ApiProperty({
        description: 'Description product',
        example: 'Abc',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    describeProduct: string;

    @ApiProperty({
        description: 'Status',
        example: 'show'
    })
    @IsString()
    @IsOptional()
    @IsEnum(['show', 'hidden'])
    status: string;

    @ApiProperty({
        description: 'unit of product',
        example: 'kg'
    })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    unit: string;

    @ApiProperty({
        description: 'purchase pice of product',
        example: '100000'
    })
    @IsNumber()
    @IsOptional()
    purchasePrice: number;

    @ApiProperty({
        description: 'sale pice of product',
        example: '100000'
    })
    @IsNumber()
    @IsOptional()
    salePice: number;

}

export class updateProductDto {

    @ApiProperty({
        description: 'Category ID associated with the product',
        example: '60d21bb67c1b2c001f6472d4',
        required: false,
    })
    @IsMongoId()
    @IsOptional()
    categoryId: string;

    @ApiProperty({
        description: 'Name product',
        example: 'Phân bón',
        required: false, // Đảm bảo thuộc tính này là tùy chọn trong quá trình cập nhật
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    productName: string;

    @ApiProperty({
        description: 'Description product',
        example: 'Abc',
        required: false,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    describeProduct: string;

    @ApiProperty({
        description: 'Status',
        example: 'show',
        required: false, // Đảm bảo thuộc tính này là tùy chọn trong quá trình cập nhật
    })
    @IsString()
    @IsOptional()
    @IsEnum(['show', 'hidden'])
    status: string;

    @ApiProperty({
        description: 'unit of product',
        example: 'kg',
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(20)
    unit: string;

    @ApiProperty({
        description: 'purchase pice of product',
        example: '100000',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    purchasePrice: number;

    @ApiProperty({
        description: 'sale pice of product',
        example: '100000',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    salePice: number;
}