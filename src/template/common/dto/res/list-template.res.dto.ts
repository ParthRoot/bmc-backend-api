import { ApiProperty } from '@nestjs/swagger';
import { TemplateEntity } from 'src/db/entity';

export class ListTemplateResDto {
  template: TemplateData[];
  constructor(templateData: TemplateEntity[]) {
    this.template = templateData.map((item) => new TemplateData(item));
  };
}

export class TemplateData {
  @ApiProperty({
    name: 'templateId',
    description: 'templateId',
    type: String,
    required: true,
  })
  templateId: string;

  @ApiProperty({
    name: 'name',
    description: 'templateName',
    type: String,
    required: true,
  })
  name: string;

  @ApiProperty({
    name: 'value',
    description: 'templateValue',
    type: String,
    required: true,
  })
  value: string;

  @ApiProperty({
    name: 'description',
    description: 'templateDescription',
    type: String,
    required: true,
  })
  description: string;

  @ApiProperty({
    name: 'icon',
    description: 'icon',
    type: String,
    required: true,
  })
  icon: string;

  constructor(data: any) {
    this.templateId = data.id;
    this.name = data.name;
    this.value = data.value;
    this.description = data.description;
    this.icon = data.icon;
  }
}
