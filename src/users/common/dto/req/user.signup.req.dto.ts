import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserSignUpReqDto {

    @ApiProperty({
        description: 'enter email',
        example: 'parthitadara@gmail.com',
        type: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'enter name',
        example: 'Parth',
        type: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'enter password',
        example: 'Hello@342',
        type: 'string',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
    password: string;

}