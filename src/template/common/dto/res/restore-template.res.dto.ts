import { ApiProperty } from '@nestjs/swagger';

export class RestoreTemplateResDto {
  @ApiProperty({
    name: 'templateId',
    description: 'templateId',
    type: String,
    required: true,
  })
  templateId: string;

  @ApiProperty({
    name: 'value',
    description: 'templateValue',
    type: String,
    required: true,
  })
  value: string;

  @ApiProperty({
    name: 'is_current_version',
    description: 'is_current_version',
    type: String,
    required: true,
  })
  is_current_version: string;

  @ApiProperty({
    name: 'created_at',
    description: 'created date',
    type: String,
    required: true,
  })
  created_at: string;

  @ApiProperty({
    name: 'update_at',
    description: 'updated date',
    type: String,
    required: true,
  })
  updated_at: string;

  constructor(data: any) {
    this.templateId = data.id;
    this.value = data.value;
    this.is_current_version = data.is_current_version;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
