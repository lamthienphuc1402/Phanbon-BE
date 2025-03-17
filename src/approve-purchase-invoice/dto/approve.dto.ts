import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty, IsOptional, IsString, MaxLength, IsEnum, IsNumber } from "class-validator";

export class approveDto {
    @ApiProperty({
        description: 'id of purchase invoice',
        example: '66dada5875dc7a02ef98e54b'
    })
    @IsString()
    @IsNotEmpty()
    purchaseInvoiceId: string;


    @ApiProperty({
        description: 'approve for purchase invoice',
        example: 'rejected'
    })
    @IsString()
    @IsOptional()
    @IsEnum(['approved', 'rejected'])
    approveStatus: string;
    static approveStatus: string;



}
