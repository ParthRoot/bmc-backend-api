import { ApiProperty } from '@nestjs/swagger';
import { GetSaveTemplateResDto } from './getsave-template.res.dto';
import { Any } from 'typeorm';

export class BaseDeleteSaveTemplateResDto {
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
    type: 'any',
    required: false,
  })
  data: any;

  constructor(message: string, data) {
    this.message = message;
    this.is_error = false;
    this.data = data;
  }
}
