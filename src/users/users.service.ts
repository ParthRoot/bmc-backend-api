import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entity';
import { TokenType } from 'src/db/entity/token.entity';
import { RoleAvaialbleError, RoleAvailableRepository, RoleRepository, TokenRepository, UserAvaialbleError, UserRepository } from 'src/db/repository';
import { comparePassword, emailVerify, generateSaltAndHash, getEnv, jwtSign, jwtSignForEmailVerification } from 'src/utils';
import { UsersLoginReqDto, UsersSignUpReqDto } from './common/dto/req';
import { UsersCreateResDto, UsersLoginResDto, VerifyEmailResDto } from './common/dto/res';

const moment = require('moment');

export class UserError extends Error {
  constructor(message: string) {
    super(message);
  }
}

@Injectable()
export class UsersService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly roleAvailableRepository: RoleAvailableRepository
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
      throw new UserAvaialbleError(`messages.userProfileNotExist`);
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

  private async findEmailVerificationToken(userId: string) {
    const token = await this.tokenRepository.findOne({
      where: {
        user: {
          id: userId
        },
        token_type: TokenType.EmailConfirmation
      }
    });

    if (!token) {
      return false;
    }
    return token;
  }

  private async deleteExpiredEmailVerificationToken(userId: string) {
    await this.tokenRepository.delete({
      user: {
        id: userId
      },
      token_type: TokenType.EmailConfirmation
    });
    return;
  }

  private async updateUser(userId: string, data: object) {
    await this.userRepository.update(userId, data);
  }

  private async generateNewEmailVerificationToken(
    user: UserEntity,
    attempts: number
  ) {
    const curreTime = moment().toDate();
    const expiry = moment().add(1, 'day').toDate();
    const newJwtToken = jwtSignForEmailVerification({
      email: user.email,
      id: user.id
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
      const emailVerification = await this.generateNewEmailVerificationToken(newUser, 1);
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
      const verifyToken = Object(emailVerify(token));

      const userExists = await this.checkUserAvailableViaEmail(verifyToken.email);

      if (!userExists) {
        throw new Error('User not found');
      }

      if (userExists.is_verified) {
        throw new Error("User is already verified");
      }

      userExists.is_verified = true;
      await this.updateUser(verifyToken.id, userExists);

      await this.deleteExpiredEmailVerificationToken(verifyToken.id);

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
        if (token.attempts > parseInt(getEnv('MAX_EMAIL_VERIFICATION_ATTEMPTS', '3'))) {
          throw new Error('You exceed daily email verification limit please check your email & verifiy.');
        }
        await this.deleteExpiredEmailVerificationToken(user.id);
        await this.generateNewEmailVerificationToken(user, token.attempts + 1);
      }
    } catch (e) {
      throw e;
    }
  }

  async loginUser(
    userLogin: UsersLoginReqDto
  ): Promise<UsersLoginResDto> {
    try {
      const { email, password } = userLogin;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: { role: { role: true } }
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

      const isPasswordValid = comparePassword(password, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Please enter correct password');
      }

      const data = { id: user.id, email: user.email, role: user.role[0].role.name };
      const token = jwtSign(data);

      return new UsersLoginResDto(token);
    } catch (error) {
      console.error('An error occurred while logging in the user: ', error);
      throw new Error(error.message);
    }
  }
}
