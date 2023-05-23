import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RestoreTemplateReqDto {
  @ApiProperty({
    description: 'enter template_id here',
    example: '1e9d17d5-a828-47c6-969a-ed571e3818cc',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  template_id?: string;

  @ApiProperty({
    description: 'enter your version_id here',
    example: '1e9d17d5-a828-47c6-969a-ed571e3818cc',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  version_id?: string;
}
