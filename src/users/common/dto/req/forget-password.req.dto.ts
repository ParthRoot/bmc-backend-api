import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgetPasswordReqDto {
  @ApiProperty({
    description: 'enter your registered email here',
    example: 'user@gmail.com',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
