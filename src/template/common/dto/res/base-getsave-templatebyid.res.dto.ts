import { ApiProperty } from '@nestjs/swagger';
import { GetSaveTemplateByIdResDto } from './getsave-templatebyid.res.dto';

export class BaseGetSaveTemplateByIdResDto {
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
    type: GetSaveTemplateByIdResDto,
    required: false,
  })
  data: GetSaveTemplateByIdResDto;

  constructor(message: string, data) {
    this.message = message;
    this.is_error = false;
    this.data = new GetSaveTemplateByIdResDto(data);
  }
}
