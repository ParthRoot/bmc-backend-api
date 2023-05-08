import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersLoginResDto } from './common/dto/res';
import { BaseResDto } from './common/dto/res/base.res.dto';
import {message} from 'src/utils/message';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @ApiTags('users')
  @ApiCreatedResponse({
    description: 'user login successfully',
    type: UsersLoginResDto,
  })
  @ApiNotFoundResponse({
    description: 'user cannot found',
  })
  @ApiUnauthorizedResponse({
    description: 'user cannot login',
  })
  @Post('login')
  async userLogin(
    @Body() userloginDto : UsersLoginReqDto
  ): Promise<BaseResDto<UsersLoginResDto>> {
    const result = await this.usersService.loginUser(userloginDto)
    return new BaseResDto(message.loginUser, result)
  }
}
