import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entity';
import { TokenType } from 'src/db/entity/token.entity';
import {
  RoleAvaialbleError,
  RoleAvailableRepository,
  RoleRepository,
  TokenRepository,
  UserAvaialbleError,
  UserRepository,
} from 'src/db/repository';
import {
  UserPayload,
  VerifyEmailTokenPayload,
  comparePassword,
  emailVerify,
  generateSaltAndHash,
  getEnv,
  jwtSign,
  jwtSignForEmailVerification,
  otpGenerator,
} from 'src/utils';
import {
  ChangePasswordReqDto,
  UsersLoginReqDto,
  UsersSignUpReqDto,
} from './common/dto/req';
import {
  UsersCreateResDto,
  UsersLoginResDto,
  VerifyEmailResDto,
} from './common/dto/res';


import axios from 'axios';
import { message } from 'src/utils/message';
import { OAuth2Client } from 'google-auth-library';

// import querystring from 'querystring';
const querystring = require('querystring');
const moment = require('moment');

export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class UsersService {
  constructor(
    @Inject('GOOGLE_AUTH') private readonly googleAuth: OAuth2Client,
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly roleAvailableRepository: RoleAvailableRepository,
  ) { }

  /**
   * It will check that role is available in the database
   * @param role string
   * @returns Promise<RoleAvailableRepository | null>
   */
  private async assertRoleAvailable(role: string) {
    const data = await this.roleAvailableRepository.findOne({
      where: {
        name: role,
      },
    });

    if (!data) {
      throw new RoleAvaialbleError(`${role} is not available`);
    }

    return data;
  }

  /**
   * It will check user exist in the database.
   * @param email string
   * @returns UserEntity
   */
  private async assertUserAvailableViaEmail(email: string) {
    const user = await this.userRepository.findOne({  
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserAvaialbleError(message.userProfileNotExist);
    }

    return user;
  }

  /**
   * It will check User exist in the database.
   * @param email string
   * @returns UserEntity
   */
  private async checkUserAvailableViaEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return false;
    }

    return user;
  }

  /**
   * it will create new user.
   * @param payload sign up API body
   * @returns
   */
  private async createNewUser(payload: UsersSignUpReqDto) {
    const passHash = await generateSaltAndHash(payload.password);

    const user = this.userRepository.create();
    user.email = payload.email;
    user.name = payload.name;
    user.password_hash = passHash.passwordHash;
    user.avatar = payload?.avatar ?? null;
    user.is_verified = false;

    const saveUser = await this.userRepository.save(user);

    return saveUser;
  }

  /**
   * it will find token for verification
   * @param userId find token for verification
   * @returns token
   */
  private async findEmailVerificationToken(userId: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        token_type: TokenType.EmailConfirmation,
      },
    });

    if (!token) {
      return false;
    }
    return token;
  }

  /**
   * it will delete expire verification token
   * @param userId expired token wil delete
   * @returns delete token
   */
  private async deleteExpiredEmailVerificationToken(userId: string) {
    await this.tokenRepository.delete({
      user: {
        id: userId,
      },
      token_type: TokenType.EmailConfirmation,
    });
    return;
  }

  /**
   * it generate new token
   * @param user UserEntity
   * @param attempts number
   * @returns token
   */
  private async updateUser(data: UserEntity) {
    await this.userRepository.update(data.id, data);
  }

  private async generateNewEmailVerificationToken(
    user: UserEntity,
    attempts: number,
  ) {
    const curreTime = moment().toDate();
    console.log(curreTime);
    const expiry = moment().add(1, 'day').toDate();
    const newJwtToken = jwtSignForEmailVerification({
      email: user.email,
      userId: user.id,
    });
    const token = await this.tokenRepository.create();
    token.user = user;
    token.token_type = TokenType.EmailConfirmation;
    token.attempts = attempts;
    token.token_generation_date = curreTime;
    token.token_expiration_date = expiry;
    token.token = newJwtToken;

    const newToken = await this.tokenRepository.save(token);

    return newToken;
  }

  /**
   * it will give otp when user forget password
   * @param user generate otp
   * @param attempts numbr of attempts return
   * @returns otp in mail
   */
  private async generateForgetPasswordOtp(user: UserEntity, attempts: number) {
    const curreTime = moment().toDate();
    const expiry = moment().add(15, 'minutes').toDate();
    const newOtp = otpGenerator(6);

    const otp = await this.tokenRepository.create();
    otp.user = user;
    otp.token_type = TokenType.ForgotPassword;
    otp.attempts = attempts;
    otp.token_generation_date = curreTime;
    otp.token_expiration_date = expiry;
    otp.token = newOtp;

    const newToken = await this.tokenRepository.save(otp);

    return newToken;
  }

  /**
   * it finds otp exist in table
   * @param userId find any otp exist
   * @returns otp
   */
  private async findForgetPasswordOtp(userId: string) {
    const otp = await this.tokenRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        token_type: TokenType.ForgotPassword,
      },
    });

    if (!otp) {
      return false;
    }
    return otp;
  }

  /**
   * it delete expired otp in token table
   * @param userId delete expired otp
   * @returns delete otp
   */
  private async deleteExpiredForgetPasswordOtp(userId: string) {
    await this.tokenRepository.delete({
      user: {
        id: userId,
      },
      token_type: TokenType.ForgotPassword,
    });
    return;
  }

  /**
   * it will update old password to new password
   * @param userId  update new password
   * @param newPassword generate new password
   */
  private async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Hash the new password before saving it to the database
      const hashedPassword = await generateSaltAndHash(newPassword);

      // Update the user's password in the database
      await this.userRepository.update(userId, {
        password_hash: hashedPassword.passwordHash,
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * 
   * @param payload 
   * @returns 
   */
  async userSignUp(payload: UsersSignUpReqDto) {
    try {
      const role = await this.assertRoleAvailable('NORMAL');
      const userExists = await this.checkUserAvailableViaEmail(payload.email);

      if (userExists) {
        throw new Error('User Already Exists with given email');
      }

      const newUser = await this.createNewUser(payload);

      // assign the role
      const assign = this.roleRepository.create({
        user: newUser,
        role: role,
      });
      await this.roleRepository.save(assign);
      const emailVerification = await this.generateNewEmailVerificationToken(
        newUser,
        1,
      );
      return new UsersCreateResDto(newUser);
    } catch (e) {
      throw e;
    }
  }

  /**
   * verify user email using link
   * @param token
   * @returns
   */
  async verifyEmail(token: string): Promise<VerifyEmailResDto> {
    try {
      const verifyToken = emailVerify(token) as VerifyEmailTokenPayload;

      const userExists = await this.checkUserAvailableViaEmail(
        verifyToken.email,
      );

      if (!userExists) {
        throw new Error('User not found');
      }

      if (userExists.is_verified) {
        throw new Error('User is already verified');
      }

      userExists.is_verified = true;
      await this.updateUser(userExists);

      await this.deleteExpiredEmailVerificationToken(verifyToken.userId);

      return new VerifyEmailResDto(userExists);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async resendEmailVerification(email: string) {
    try {
      const currentDate = moment().unix();
      const user = await this.assertUserAvailableViaEmail(email);

      if (user.is_verified) {
        throw new Error('user is already verified');
      }

      const token = await this.findEmailVerificationToken(user.id);

      if (!token) {
        await this.generateNewEmailVerificationToken(user, 1);
      } else if (currentDate > moment(token.token_expiration_date).unix()) {
        await this.deleteExpiredEmailVerificationToken(user.id);
        await this.generateNewEmailVerificationToken(user, 1);
      } else {
        if (
          token.attempts >
          parseInt(getEnv('MAX_EMAIL_VERIFICATION_ATTEMPTS', '3'))
        ) {
          throw new Error(
            'You exceed daily email verification limit please check your email & verifiy.',
          );
        }
        await this.deleteExpiredEmailVerificationToken(user.id);
        await this.generateNewEmailVerificationToken(user, token.attempts + 1);
      }
    } catch (e) {
      throw e;
    }
  }

  async loginUser(userLogin: UsersLoginReqDto): Promise<UsersLoginResDto> {
    try {
      const { email, password } = userLogin;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: { role: { role: true } },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.is_verified) {
        throw new Error('User is not verified');
      }

      if (!user.is_active) {
        throw new Error('User is not active, please contact admin');
      }

      const isPasswordValid = await comparePassword(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        throw new Error('Please enter correct password');
      } else {
        const data = {
          id: user.id,
          email: user.email,
          role: user.role[0].role.name,
        };
        const token = jwtSign(data);

        return new UsersLoginResDto(token);
      }
    } catch (error) {
      console.error('An error occurred while logging in the user: ', error);
      throw new Error(error.message);
    }
  }

  async changePassword(data: ChangePasswordReqDto, user: UserPayload) {
    try {
      const userExists = await this.checkUserAvailableViaEmail(
        user.email,
      );

      if (!userExists) {
        throw new Error('User not found');
      }

      if (!userExists.is_verified) {
        throw new Error('User is not verified');
      }

      if (!userExists.is_active) {
        throw new Error('User is not active, please contact admin');
      }

      const isPasswordValid = await comparePassword(
        data.oldPassword,
        userExists.password_hash,
      );

      if (!isPasswordValid) {
        throw new Error('Please enter your correct password');
      }

      const passHash = await generateSaltAndHash(data.newPassword);

      userExists.password_hash = passHash.passwordHash;
      await this.updateUser(userExists);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async forgetPassword(email: string) {
    try {
      const currentDate = moment().unix();
      const user = await this.assertUserAvailableViaEmail(email);

      if (!user.is_active) {
        throw new Error('User is not active, contact the admin');
      }

      if (!user.is_verified) {
        throw new Error('User is not verified');
      }

      let otp = await this.findForgetPasswordOtp(user.id);

      if (otp === false) {
        otp = await this.generateForgetPasswordOtp(user, 1);
      } else if (currentDate > moment(otp.token_expiration_date).unix()) {
        await this.deleteExpiredForgetPasswordOtp(user.id);
        otp = await this.generateForgetPasswordOtp(user, 1);
      } else {
        await this.deleteExpiredForgetPasswordOtp(user.id);
        await this.generateForgetPasswordOtp(user, otp.attempts + 1);
      }
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const currentDate = moment().unix();
      const user = await this.assertUserAvailableViaEmail(email);
      const forgetPassOtp = await this.findForgetPasswordOtp(user.id);

      if (!forgetPassOtp) {
        throw new Error('Otp is invalid');
      }

      if (otp !== forgetPassOtp.token) {
        throw new Error('OTP Does not match');
      }

      if (currentDate > moment(forgetPassOtp.token_expiration_date).unix()) {
        throw new Error('OTP has expired');
      }

      await this.updateUserPassword(user.id, newPassword);
      await this.deleteExpiredForgetPasswordOtp(user.id);
    } catch (e) {
      throw e;
    }
  }


  async getGoogleAuthURL() {
    const rootUrl = getEnv('ROOT_URL');
    const redirectUrl = getEnv('REDIRECT_URL');
    const clientId = getEnv('CLIENT_ID');

    const options = {
      redirect_uri: redirectUrl,
      client_id: clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
  }



  /**
   * Function to fetch Google user information
   * @param accessToken 
   * @param idToken 
   * @returns google user info
   */
  async fetchGoogleUserInfo(accessToken, idToken) {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data;
  }

  /**
   * Function to create a user from Google data
   * @param googleUser 
   */
  async createUserFromGoogle(googleUser) {
    const user = this.userRepository.create({
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.picture || null,
      social_id: googleUser.id,
      is_verified: googleUser.verified_email,
    });

    const saveUser = await this.userRepository.save(user);
    const role = await this.assertRoleAvailable('NORMAL');

    const assign = this.roleRepository.create({
      user: saveUser,
      role: role,
    });

    await this.roleRepository.save(assign);
  }

  /**
   * Function to get user by email with role information
   * @param email 
   * @returns user id, email and role
   */
  async getUserByEmailWithRole(email) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { role: { role: true } },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role[0].role.name,
    };
  }

  /**
   * Function to generate token
   * @param user 
   * @returns token
   */
  generateToken(user) {
    const data = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwtSign(data);
    return token;
  }

  /**
   * 
   * @param code 
   * @returns login jwt token
   */
  async getGoogleUser(code) {
    try {
      const { tokens } = await this.googleAuth.getToken(code);
      const { access_token, id_token } = tokens;

      const googleUser = await this.fetchGoogleUserInfo(access_token, id_token);
      console.log("googleUser: ", googleUser);
      const userExists = await this.checkUserAvailableViaEmail(googleUser.email);

      if (!userExists) {
        await this.createUserFromGoogle(googleUser);
      }

      const user = await this.getUserByEmailWithRole(googleUser.email);
      const token = this.generateToken(user);

      return token;
    } catch (err) {
      throw new Error(`${err.message}`);
    }
  }
}
