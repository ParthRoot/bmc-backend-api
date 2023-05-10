import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResDto {
    @ApiProperty({
        name: 'name',
        description: 'name',
        type: 'string',
        required: true,
    })
    name: string;

    @ApiProperty({
        name: 'email',
        description: 'email',
        type: 'string',
        required: true,
    })
    email: string;

    constructor(
        data
    ) {
        this.name = data.name;
        this.email = data.email;

    }
}