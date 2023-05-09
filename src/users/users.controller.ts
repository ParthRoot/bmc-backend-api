import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('resend-verification-email')
  async resendEmailVerification(@Body() body: any) {
    const result = await this.usersService.resendEmailVerification(body.email);
  }
}
