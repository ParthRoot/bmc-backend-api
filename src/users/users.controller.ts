import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpReqDto } from './common/dto/req/index';
import { UserSignUpResDto, VerifyUserResDto } from './common/dto/res/index';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { AvailableRoleEnum } from 'src/utils';
import { BaseResDto } from './common/dto/res/base.res.dto';
import messages from 'src/utils/messages';

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
  async userSignUp(@Body() data: UserSignUpReqDto): Promise<BaseResDto<UserSignUpResDto>> {
    const result = await this.usersService.userSignUp(data, AvailableRoleEnum.NORMAL);
    return new BaseResDto(messages.userSignUp, result);
  }

  @Get('verifyEmail/:token')
  @ApiCreatedResponse({
    type: VerifyUserResDto,
    description: 'verified user',
  })
  @ApiNotFoundResponse({
    description: 'user is not found'
  })
  @ApiConflictResponse({
    description: 'user is already verified',
  })
  async verifyEmail(@Param('token') token: string): Promise<BaseResDto<VerifyUserResDto>> {
    const result = await this.usersService.verifyEmail(token);
    return new BaseResDto(messages.verifyToken, result);
  }
};
