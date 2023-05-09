import { Injectable } from '@nestjs/common';
import { UserRepository, RoleRepository, RoleAvailableRepository, TokenRepository } from 'src/db/repository';
import { ReSendVerificationLinkReqDto, UserSignUpReqDto } from './common/dto/req';
import { ReSendVerificationLinkResDto, UserSignUpResDto, VerifyUserResDto } from './common/dto/res';
import * as bcrypt from 'bcryptjs';
import { jwtSign, jwtSignForEmailVerification, jwtVerifyForEmailVerification } from 'src/utils';
import { TokenType } from 'src/db/entity';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { UsersLoginResDto } from './common/dto/res/users.login.response.dto';
const moment = require('moment');

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly roleAvailableRepository: RoleAvailableRepository,
    private readonly tokenRepository: TokenRepository
  ) { }

  async userSignUp(userSignUpReqDto: UserSignUpReqDto, roleName): Promise<UserSignUpResDto> {
    try {
      const { email, name, password } = userSignUpReqDto;

      const userExists = await this.userRepository.findOneBy({ email });

      const roleExists = await this.roleAvailableRepository.findOneBy({ is_active: true, name: roleName });

      if (userExists) {
        throw new Error(`email is already exists`);
      }

      if (!roleExists) {
        throw new Error(`${roleName} does not exists`);
      }

      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({ email, name, password_hash });
      const savedUser = await this.userRepository.save(user);

      const data = { id: savedUser.id, email: savedUser.email };
      const token = jwtSignForEmailVerification(data);

      const role = await this.roleRepository.create();
      role.user = savedUser;
      role.role = roleExists;
      await this.roleRepository.save(role);

      const tokenStore = await this.tokenRepository.create({
        token: token, token_type: TokenType.EmailConfirmation, attempts: 1,
        token_generated_date: moment(),
        token_expired_date: moment().add(1, 'days'),
        user: savedUser
      });

      await this.tokenRepository.save(tokenStore);

      return new UserSignUpResDto(savedUser);
    } catch (error) {
      throw new Error(`Could not signUp user ${error.message}`);
    }
  }

  /**
   * verify user email using link
   * @param token 
   * @returns 
   */
  async verifyEmail(token: string): Promise<VerifyUserResDto> {
    try {
      const verifyToken = Object(jwtVerifyForEmailVerification(token));

      const userExists = await this.userRepository.findOneBy({ email: verifyToken.email });

      if (!userExists) {
        throw new Error('User not found');
      }

      if (userExists.is_verified) {
        throw new Error("User is already verified");
      }

      userExists.is_verified = true;
      await this.userRepository.update({ email: verifyToken.email }, userExists);

      await this.tokenRepository.delete({ user: verifyToken.id });

      return new VerifyUserResDto(userExists);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async reSendVerificationLink(data: ReSendVerificationLinkReqDto): Promise<ReSendVerificationLinkResDto> {
    try {

      const is_Token_Available = await this.tokenRepository.findOne({
        where: { user: { email: data.email, is_verified: false } },
        relations: ['user'],
      });

      if (is_Token_Available.attempts >= 3) {
        throw Error('You have exceeded the maximum number of attempts, Please try again after 24 hours');
      }

      const nowDateTime = moment();
      const is_Expired_Token = nowDateTime.isAfter(is_Token_Available.token_expired_date);

      if (is_Expired_Token) {

        const data = { id: is_Token_Available.user.id, email: is_Token_Available.user.email };
        const token = jwtSignForEmailVerification(data);

        is_Token_Available.token = token;
        is_Token_Available.attempts = 1;
        is_Token_Available.token_generated_date = moment();
        is_Token_Available.token_expired_date = moment().add(1, 'days');

        await this.tokenRepository.update({ id: is_Token_Available.id }, is_Token_Available);
      } else {
        await this.tokenRepository.increment({ id: is_Token_Available.id }, 'attempts', 1);
      }

      return new ReSendVerificationLinkResDto(is_Token_Available);
    } catch (error) {
      throw new Error(`${error.message}`);
    }

  }

  async loginUser(userLogin: UsersLoginReqDto): Promise<UsersLoginResDto> {
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

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

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