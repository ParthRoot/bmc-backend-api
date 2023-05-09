import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class UserSignUpResDto {
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
        type: 'email',
        required: true,
    })
    email: string;

    constructor(data) {
        this.name = data.name;
        this.email = data.email;
    }
}