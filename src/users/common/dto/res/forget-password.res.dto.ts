import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/db/entity';

export class ForgetPasswordResDto {

  @ApiProperty({
    name: 'otp',
    description: 'otp',
    type: 'string',
    required: true,
  })
  otp: string;

  constructor(data: string) {
    this.otp = data;
  }
}
