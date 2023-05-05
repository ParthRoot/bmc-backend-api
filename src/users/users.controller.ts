/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpReqDto } from './common/dto/req/index';
import { UserSignUpResDto } from './common/dto/res/index';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { AvailableRoleEnum } from 'src/utils';

@ApiTags("User")
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('signUp')
  @ApiBody({ type: UserSignUpReqDto, description: "signup successfully" })
  @ApiCreatedResponse({
    type: UserSignUpResDto,
    description: 'registered agent',
  })
  @ApiConflictResponse({
    description: 'user is already exist',
  })

  @ApiNotFoundResponse({
    description: 'role is not found'
  })
  async userSignUp(@Body() data: UserSignUpReqDto): Promise<UserSignUpResDto> {
    return await this.usersService.userSignUp(data, AvailableRoleEnum.NORMAL);
  }
};
