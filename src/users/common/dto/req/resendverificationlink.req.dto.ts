import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class ReSendVerificationLinkReqDto {
    @ApiProperty({
        description: 'enter email',
        example: 'parthitadara@gmail.com',
        type: 'string',
        required: true
    })
    @IsNotEmpty()
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail()
    email: string;
}