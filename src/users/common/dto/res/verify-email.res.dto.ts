import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResDto {
  @ApiProperty({
    name: 'name',
    description: 'name',
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    name: 'email',
    description: 'email',
    type: String,
    required: true,
  })
  email: string;

  constructor(data) {
    this.name = data.name;
    this.email = data.email;
  }
}
