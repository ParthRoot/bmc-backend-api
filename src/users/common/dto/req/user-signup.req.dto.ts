import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UsersSignUpReqDto {
  @ApiProperty({
    description: 'enter your registered email here',
    example: 'user@gmail.com',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'enter your password',
    example: 'password',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;

  @ApiProperty({
    description: 'enter your name here',
    example: 'shiv',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'avatar',
    example: 'avatar link',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  avatar?: string;
}
