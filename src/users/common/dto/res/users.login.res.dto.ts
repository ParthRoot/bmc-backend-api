import { ApiProperty } from '@nestjs/swagger';

export class UsersLoginResDto {

  @ApiProperty({
    name: 'token',
    description: 'token',
    type: String,
    required: true,
  })
  token: string;

  constructor(data) {
    this.token = data;
  }
}
