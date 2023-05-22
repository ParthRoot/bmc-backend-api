import { ApiProperty } from '@nestjs/swagger';
import { GetGoogleAuthUrlResDto } from './get-google-auth-url.res.dto';

export class BaseGetGoogleAuthUrlResDto {
  @ApiProperty({
    name: 'message',
    description: 'message',
    type: String,
    required: true,
  })
  message: string;

  @ApiProperty({
    name: 'error',
    description: 'if error then true otherwise false',
    type: Boolean,
    required: true,
  })
  is_error: boolean;

  @ApiProperty({
    name: 'Data',
    description: 'data',
    type: GetGoogleAuthUrlResDto,
    required: false,
  })
  data: GetGoogleAuthUrlResDto;

  constructor(message: string, data: any) {
    this.message = message;
    this.is_error = false;
    this.data = new GetGoogleAuthUrlResDto(data);
  }
}
