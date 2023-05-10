import { ApiProperty } from '@nestjs/swagger';
import { UsersCreateResDto } from './user-create.res.dto';

export class BaseSignUpResDto {
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
        type: UsersCreateResDto,
        required: false
    })
    data: UsersCreateResDto;

    constructor(
        message: string,
        data: any
    ) {
        this.message = message;
        this.is_error = false;
        this.data = new UsersCreateResDto(data);
    }
}