import { ApiProperty } from '@nestjs/swagger';

export class GetGoogleAuthUrlResDto {
  @ApiProperty({
    description: 'url',
    example: 'url',
    required: true,
    type: String,
  })
  url: string;

  constructor(data) {
    this.url = data;
  }
}
