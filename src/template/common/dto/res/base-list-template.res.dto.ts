import { ApiProperty } from '@nestjs/swagger';
import { ListTemplateResDto } from './list-template.res.dto';

export class BaseListTemplateResDto {
  @ApiProperty({
    name: 'message',
    description: 'message',
    type: 'string',
    required: true,
  })
  message: string;

  @ApiProperty({
    name: 'error',
    description: 'if error then true otherwise false',
    type: 'boolean',
    required: true,
  })
  is_error: boolean;

  @ApiProperty({
    name: 'Data',
    description: 'data',
    type: ListTemplateResDto,
    required: false,
  })
  data: ListTemplateResDto;

  constructor(message: string, data: any) {
    this.message = message;
    this.is_error = false;
    this.data = new ListTemplateResDto(data);
  }
}