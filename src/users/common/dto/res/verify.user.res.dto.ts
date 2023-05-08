import { ApiProperty } from '@nestjs/swagger';
import { BaseResDto } from './base.res.dto';

export class VerifyUserResDto {
    @ApiProperty({
        name: 'message',
        description: 'message',
        type: 'string',
        required: true,
    })
    name: string;

    constructor(
        data
    ) {
        this.name = data;

    }
}