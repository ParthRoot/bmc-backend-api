import { ApiProperty } from '@nestjs/swagger';
import { RestoreTemplateResDto } from './restore-template.res.dto';


export class BaseRestoreTemplateResDto {
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
    type: RestoreTemplateResDto,
    required: false,
  })
  data: RestoreTemplateResDto;

  constructor(message: string, data: any) {
    this.message = message;
    this.is_error = false;
    this.data = new RestoreTemplateResDto(data);
  }
}