import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString, MinLength } from 'class-validator';

export class GetGoogleUserReqDto {
  @ApiProperty({
    description: 'code',
    example: '4/0AbUR2VNL_okm6p55WzVVsq4YR3XDHd423Bw_tBoZnabjqFpQ08UC2GCKSI5DX1xvWwnQvA',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  code: string;
}

