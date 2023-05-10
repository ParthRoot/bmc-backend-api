import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/db/entity';

export class UsersCreateResDto {

    @ApiProperty({
        description: 'user id',
        example: '123456789',
        required: true,
        type: String
    })
    id: string;

    @ApiProperty({
        description: 'User Email',
        example: 'user@gmail.com',
        required: true,
        type: String
    })
    email: string;

    @ApiProperty({
        description: 'user name',
        example: 'shiv',
        required: true,
        type: String
    })
    name: string;

    @ApiProperty({
        description: 'avatar',
        example: 'avatar link',
        required: false,
        type: String
    })
    avatar?: string;

    constructor(data: UserEntity) {
        this.id = data.id;
        this.email = data.email;
        this.name = data.name;
        this.avatar = data.avatar;
    }
}
