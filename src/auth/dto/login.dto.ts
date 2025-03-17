import { ApiProperty } from "@nestjs/swagger";  
import { IsDate,MinLength, IsEmail, IsNotEmpty, IsString, MaxLength,Matches, Min } from "class-validator";

export class LoginDto {
    
    @ApiProperty({
        description: 'enter username',
        example: 'MasterAdmin'
    })
    @IsString()
    @MaxLength(80)
    @MinLength(3)
    account: string;

    @ApiProperty({
        description: 'enter password',
        example: 'Admin@123'
    })
    @IsString()
    @IsNotEmpty({message:'Password is required'})
    @MaxLength(80)
    
    password: string;

   
}