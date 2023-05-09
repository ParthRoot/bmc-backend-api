import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UsersLoginReqDto {
  @ApiProperty({
    description: 'enter your registered email here',
    example: 'user@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'enter your password',
    example: 'password',
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}
