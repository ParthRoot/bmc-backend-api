import { ApiProperty } from '@nestjs/swagger';

export class GetGoogleUserResDto {
  @ApiProperty({
    description: 'url',
    example: 'url',
    required: true,
    type: String,
  })
  token: string;

  constructor(data) {
    this.token = data;
  }
}
