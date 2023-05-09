import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, HttpException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpReqDto } from './common/dto/req/index';
import { UserSignUpResDto, VerifyUserResDto } from './common/dto/res/index';
import { ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AvailableRoleEnum } from 'src/utils';
import messages from 'src/utils/messages';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { BaseResDto, UsersLoginResDto } from './common/dto/res';
import { message } from 'src/utils/message';

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
    @Body() userloginDto: UsersLoginReqDto
  ): Promise<BaseResDto<UsersLoginResDto>> {
    const result = await this.usersService.loginUser(userloginDto);
    return new BaseResDto(message.loginUser, result);
  };
}
