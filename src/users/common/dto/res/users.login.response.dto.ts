import { ApiProperty } from '@nestjs/swagger';

export class UsersLoginResDto {
  token?: string | undefined;

  @ApiProperty({
    name: 'message',
    description: 'message',
    type: 'string',
    required: true,
})
  message : string;

  constructor(  token?: string | undefined, message?: string | undefined) {
    
    this.token = token;
    this.message = message;
  }
}
