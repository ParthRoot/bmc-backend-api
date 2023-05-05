import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post('login')
  async userLogin(
    @Body() userloginDto : UsersLoginReqDto
  ): Promise<any> {
    return await this.usersService.loginUser(userloginDto)
  }
}
