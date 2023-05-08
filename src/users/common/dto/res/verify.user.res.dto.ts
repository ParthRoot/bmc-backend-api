import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class VerifyUserResDto {
    @ApiProperty({
        name: 'message',
        description: 'message',
        type: 'string',
        required: true,
    })
    message: string;

    constructor(message) {
        this.message = message;
    }
}