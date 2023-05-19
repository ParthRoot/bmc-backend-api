import { ApiProperty } from '@nestjs/swagger';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';

export class GetSaveTemplateResDto {
  @ApiProperty({
    description: 'user id',
    example: '123456789',
    required: true,
    type: String,
  })
  template_id: string;

  // @ApiProperty({
  //   description: 'User Email',
  //   example: 'user@gmail.com',
  //   required: true,
  //   type: String,
  // })
  // name: string;

  @ApiProperty({
    description: 'user name',
    example: 'shiv',
    required: true,
    type: String,
  })
  value: string;

  @ApiProperty({
    description: 'avatar',
    example: 'avatar link',
    required: false,
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    description: 'avatar',
    example: 'avatar link',
    required: false,
    type: Date,
  })
  updated_at: Date;

  @ApiProperty({
    description: 'avatar',
    example: 'avatar link',
    required: false,
    type: Boolean,
  })
  is_current_version: boolean;

  constructor(data: SaveTemplateEntity) {
    this.template_id = data.id;
    this.value = data.value;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.is_current_version = data.is_current_version;
    this.value = data.value;
  }

}
