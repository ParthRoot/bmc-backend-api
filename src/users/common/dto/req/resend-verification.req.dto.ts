import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';


export class ResendEmailVerificationReqDto {
    @ApiProperty({
        description: 'enter your registered email here',
        example: 'user@gmail.com',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}