import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum } from "class-validator";

export class createCategoryDto {

    @ApiProperty({
        description: 'Category for product',
        example: 'Phân bón'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    categoryName: string;

    @ApiProperty({
        description: 'Status',
        example: 'show'
    })
    @IsString()
    @IsOptional()
    @IsEnum(['show', 'hidden'])
    status: string;

}

export class updateCategoryDto {
    @ApiProperty({
        description: 'Category for product',
        example: 'Phân bón',
        required: false, // Đảm bảo thuộc tính này là tùy chọn trong quá trình cập nhật
    })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    categoryName: string;

    @ApiProperty({
        description: 'Status',
        example: 'show',
        required: false, // Đảm bảo thuộc tính này là tùy chọn trong quá trình cập nhật
    })
    @IsString()
    @IsOptional()
    @IsEnum(['show', 'hidden'])
    status: string;
}