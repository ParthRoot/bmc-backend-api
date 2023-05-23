import { ApiProperty } from '@nestjs/swagger';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';

export class GetSaveTemplateResDto {
  template: SaveTemplateData[];
  constructor(saveTemplateData: SaveTemplateEntity[]) {
    this.template = saveTemplateData.map((item) => new SaveTemplateData(item));
  };
}
export class SaveTemplateData {
  @ApiProperty({
    description: 'template id',
    example: '123456789',
    required: true,
    type: String,
  })
  template_id: string;

  @ApiProperty({
    description: 'User name',
    example: 'Raj',
    required: true,
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'User id',
    example: 'userId',
    required: true,
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Value html',
    example: '<p> hey </p>>',
    required: true,
    type: String,
  })
  value?: string;

  @ApiProperty({
    description: 'template created time',
    example: 'time',
    required: false,
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'template updated time',
    example: 'time',
    required: false,
    type: Date,
  })
  updated_at: Date;

  @ApiProperty({
    description: 'current version or not',
    example: 'true',
    required: false,
    type: Boolean,
  })
  is_current_version: boolean;

  constructor(data: any) {
    this.template_id = data.id;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_current_version = data.is_current_version;
    this.name = data.user.name;
    this.id = data.user.id;
  }

}
