import { ApiProperty } from '@nestjs/swagger';
import { UsersLoginResDto } from './users.login.res.dto';


export class BaseLoginResDto {
    @ApiProperty({
        name: 'message',
        description: 'message',
        type: String,
        required: true,
    })
    message: string;

    @ApiProperty({
        name: 'error',
        description: 'if error then true otherwise false',
        type: Boolean,
        required: true,
    })
    is_error: boolean;

    @ApiProperty({
        name: 'Data',
        description: 'data',
        type: UsersLoginResDto,
        required: false
    })
    data: UsersLoginResDto;

    constructor(
        message,
        data
    ) {
        this.message = message;
        this.is_error = false;
        this.data = new UsersLoginResDto(data);
    }
}