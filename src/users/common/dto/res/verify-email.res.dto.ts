import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResDto {
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