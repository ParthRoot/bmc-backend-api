import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersLoginReqDto } from './common/dto/req/users.login.req.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BaseChangePasswordResDto,
  BaseSignUpResDto,
  BaseVerifyEmailResDto,
} from './common/dto/res';
import { message } from 'src/utils/message';
import {
  ChangePasswordReqDto,
  ResendEmailVerificationReqDto,
  UsersSignUpReqDto,
} from './common/dto/req';
import { BaseLoginResDto } from './common/dto/res/base-login.res.dto';
import { BaseEmailVerificationResendResDto } from './common/dto/res/base-email-verification-resend.res.dto';
import { AuthGuard, AvailableRoleEnum, RoleGuard } from 'src/utils';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @ApiOperation({
    summary: 'User Signup',
    description: 'Register User.',
  })
  @ApiResponse({
    status: 201,
    description: 'User SignUp',
    type: BaseSignUpResDto,
  })
  async userSignUp(@Body() body: UsersSignUpReqDto): Promise<BaseSignUpResDto> {
    const result = await this.usersService.userSignUp(body);
    return new BaseSignUpResDto(message.userSignUp, result);
  }

  @Get('verifyEmail/:token')
  @ApiOkResponse({ type: BaseVerifyEmailResDto })
  @ApiOperation({
    summary: 'User Verfied',
    description: 'User Verified',
  })
  @ApiResponse({
    status: 200,
    description: 'User Verified',
    type: BaseVerifyEmailResDto,
  })
  async verifyEmail(
    @Param('token') token: string,
  ): Promise<BaseVerifyEmailResDto> {
    const result = await this.usersService.verifyEmail(token);
    return new BaseVerifyEmailResDto(message.verifyEmail, result);
  }

  @Post('resend-verification-email')
  @ApiOperation({
    summary: 'Resend Email Verification Link.',
    description: 'Resend Email Verification Link To User Email.',
  })
  @ApiResponse({
    status: 201,
    description: 'User Email Verification Resend.',
    type: BaseEmailVerificationResendResDto,
  })
  async resendEmailVerification(
    @Body() body: ResendEmailVerificationReqDto,
  ): Promise<BaseEmailVerificationResendResDto> {
    const result = await this.usersService.resendEmailVerification(body.email);
    return new BaseEmailVerificationResendResDto(
      message.resendEmailVerification,
      {},
    );
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in a user',
    description: 'Authenticates a user and returns a token',
  })
  @ApiResponse({
    status: 201,
    description: 'User login successful',
    type: BaseLoginResDto,
  })
  async userLogin(
    @Body() userloginDto: UsersLoginReqDto,
  ): Promise<BaseLoginResDto> {
    const result = await this.usersService.loginUser(userloginDto);
    return new BaseLoginResDto(message.loginUser, result);
  }

  @UseGuards(new AuthGuard(), new RoleGuard(AvailableRoleEnum.NORMAL))
  @Post('changePassword')
  @ApiOperation({
    summary: 'change password',
    description: 'update user password',
  })
  @ApiResponse({
    status: 201,
    description: 'Password change',
    type: BaseChangePasswordResDto,
  })
  async changePassword(
    @Body() data: ChangePasswordReqDto,
    @Req() reqData,
  ): Promise<BaseChangePasswordResDto> {
    await this.usersService.changePassword(data, reqData);
    return new BaseChangePasswordResDto(message.changePassword);
  }
}
