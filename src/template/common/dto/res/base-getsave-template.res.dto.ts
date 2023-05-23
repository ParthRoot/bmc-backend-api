import { ApiProperty } from '@nestjs/swagger';
import { GetSaveTemplateResDto } from './getsave-template.res.dto';

export class BaseGetSaveTemplateResDto {
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
    type: GetSaveTemplateResDto,
    required: false,
  })
  data: GetSaveTemplateResDto;

  constructor(message: string, data) {
    this.message = message;
    this.is_error = false;
    this.data = new GetSaveTemplateResDto(data);
  }
}
