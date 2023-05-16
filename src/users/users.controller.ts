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
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  BaseChangePasswordResDto,
  BaseSignUpResDto,
  BaseVerifyEmailResDto,
  BaseEmailVerificationResendResDto,
  BaseForgetPasswordResDto,
  BaseLoginResDto,
  BaseResetPasswordResDto,
} from './common/dto/res';
import { message } from 'src/utils/message';
import {
  ChangePasswordReqDto,
  ResendEmailVerificationReqDto,
  UsersSignUpReqDto,
  ForgetPasswordReqDto,
  ResetPasswordReqDto,
} from './common/dto/req';

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
    return new BaseLoginResDto(message.loginUser, result.token);
  }

  @UseGuards(new AuthGuard())
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
  @Post('forgetPassword')
  @ApiOperation({
    summary: 'forget password of user',
    description: 'check user and returns a otp in mail',
  })
  @ApiResponse({
    status: 201,
    description: 'send otp in mail successful',
    type: BaseForgetPasswordResDto,
  })
  async forgetPassword(
    @Body() body: ForgetPasswordReqDto,
  ): Promise<BaseForgetPasswordResDto> {
    const result = await this.usersService.forgetPassword(body.email);
    return new BaseForgetPasswordResDto(message.forgetPassword, result);
  }

  @Post('resetPassword')
  @ApiOperation({
    summary: 'reset password of user',
    description: 'your password reset successfully',
  })
  @ApiResponse({
    status: 201,
    description: 'password reset',
    type: BaseResetPasswordResDto,
  })
  async resetPassword(
    @Body() body: ResetPasswordReqDto,
  ): Promise<BaseResetPasswordResDto> {
    const result = await this.usersService.resetPassword(
      body.email,
      body.otp,
      body.new_password,
    );
    return new BaseResetPasswordResDto(message.resetPassword, result);
  }
}
