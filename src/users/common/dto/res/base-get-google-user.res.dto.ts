import { ApiProperty } from '@nestjs/swagger';
import { GetGoogleUserResDto } from './get-google-user.res.dto';

export class BaseGetGoogleUserResDto {
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
    type: GetGoogleUserResDto,
    required: false,
  })
  data: GetGoogleUserResDto;

  constructor(message: string, data: any) {
    this.message = message;
    this.is_error = false;
    this.data = new GetGoogleUserResDto(data);
  }
}
