import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsObject } from 'class-validator';

export class UserSignUpResDto {
    message: string;

    constructor(message) {
        this.message = message;
    }
}