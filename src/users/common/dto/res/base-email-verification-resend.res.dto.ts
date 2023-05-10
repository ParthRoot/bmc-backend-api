import { ApiProperty } from '@nestjs/swagger';


export class BaseEmailVerificationResendResDto {
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
        type: 'any',
        required: false
    })
    data: any;

    constructor(
        message,
        data
    ) {
        this.message = message;
        this.is_error = false;
        this.data = data;
    }
}