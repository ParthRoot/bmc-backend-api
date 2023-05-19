import { ApiProperty } from '@nestjs/swagger';
import {
  IsString
} from 'class-validator';

export class SaveTemplateReqDto{
  @ApiProperty({
    description: 'enter your name here',
    example: 'shiv',
    required: true,
    type: String,
  })
  @IsString()
  value: string;
}