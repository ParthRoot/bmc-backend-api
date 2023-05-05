import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { AvailableRoleEnum, RoleGuard } from 'src/utils';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Post('login')
  async userLogin(
    @Body() userloginDto : UsersLoginReqDto
  ): Promise<any> {
    const result = await this.usersService.loginUser(userloginDto)
    return {
      data: result,
      message: 'successfully login'
    }
  }
}
