import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class ResetPasswordReqDto {
    @ApiProperty({
        description: 'enter your registered email here',
        example: 'user@gmail.com',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'enter your otp here',
        example: 'otp',
        required: true,
        type: String
    })
    @IsNotEmpty()
    otp: string;

    @ApiProperty({
        description: 'enter your new password',
        example: 'password',
        required: true,
        type: String
      })
      @IsNotEmpty()
      @MinLength(8)
      @IsString()
    new_password: string;
}