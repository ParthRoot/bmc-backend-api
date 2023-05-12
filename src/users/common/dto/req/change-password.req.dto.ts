import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordReqDto {
  @ApiProperty({
    description: 'enter your old password',
    example: 'password',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'enter your new password',
    example: 'password',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  newPassword: string;
}
