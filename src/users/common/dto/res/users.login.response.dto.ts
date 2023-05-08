import { ApiProperty } from '@nestjs/swagger';

export class UsersLoginResDto {

  @ApiProperty({
    name: 'token',
    description: 'token',
    type: 'string',
    required: true,
})

  token?: string | undefined;

  constructor(  token?: string | undefined) {
    
    this.token = token;
  }
}
