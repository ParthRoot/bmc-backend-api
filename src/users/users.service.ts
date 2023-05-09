import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/db/entity';
import { TokenType } from 'src/db/entity/token.entity';
import { TokenRepository, UserAvaialbleError, UserRepository } from 'src/db/repository';
import { getEnv, jwtSignForEmailVerification } from 'src/utils';

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
    private readonly userRepository: UserRepository
  ) { }

  /**
     * It will check user exist in the database.
     * @param email string
     * @returns UserEntity
     */
  async assertUserAvailableViaEmail(email: string) {
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

  async findEmailVerificationToken(userId: string) {
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

  async deleteExpiredEmailVerificationToken(userId: string) {
    await this.tokenRepository.delete({
      user: {
        id: userId
      },
      token_type: TokenType.EmailConfirmation
    });
    return;
  }

  async generateNewEmailVerificationToken(
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

  async resendEmailVerification(email: string) {
    try {
      const currentDate = moment().unix();
      console.log("currentDate", currentDate);
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
}
