import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class UserSignUpResDto {
    data: object;
    message: string;

    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}