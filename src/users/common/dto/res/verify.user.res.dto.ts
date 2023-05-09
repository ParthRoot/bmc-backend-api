import { ApiProperty } from '@nestjs/swagger';

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
        this.name = data.name;

    }
}