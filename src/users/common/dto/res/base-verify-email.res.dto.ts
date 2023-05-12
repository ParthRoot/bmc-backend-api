import { ApiProperty } from '@nestjs/swagger';
import { UsersLoginResDto } from './users.login.res.dto';
import { VerifyEmailResDto } from './verify-email.res.dto';


export class BaseVerifyEmailResDto {
    @ApiProperty({
        name: 'message',
        description: 'message',
        type: 'string',
        required: true,
    })
    message: string;

    @ApiProperty({
        name: 'error',
        description: 'if error then true otherwise false',
        type: 'boolean',
        required: true,
    })
    is_error: boolean;

    @ApiProperty({
        name: 'Data',
        description: 'data',
        type: UsersLoginResDto,
        required: false
    })
    data: VerifyEmailResDto;

    constructor(
        message,
        data
    ) {
        this.message = message;
        this.is_error = false;
        this.data = new VerifyEmailResDto(data);
    }
}