import { Injectable } from '@nestjs/common';
import { UserRepository, RoleRepository, RoleAvailableRepository, TokenRepository } from 'src/db/repository';
import { UserSignUpReqDto } from './common/dto/req';
import { UserSignUpResDto, VerifyUserResDto } from './common/dto/res';
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

      //hash
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);

      //create entry in user table
      const user = this.userRepository.create({ email, name, password_hash });
      const savedUser = await this.userRepository.save(user);

      //generateToken
      const data = { id: savedUser.id, email: savedUser.email };
      const token = jwtSignForEmailVerification(data);

      //create entry in role table
      const role = await this.roleRepository.create();
      role.user = savedUser;
      role.role = roleExists;
      await this.roleRepository.save(role);

      //create entry in token table
      const tokenStore = this.tokenRepository.create({
        token: token, token_type: TokenType.EmailConfirmation, attempts: 1,
        token_generated_date: moment(),
        token_expired_date: moment().add(1, 'days'),
        user: savedUser
      });

      await this.tokenRepository.save(tokenStore);

      return new UserSignUpResDto(`user register successfully`);
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
      const verifyToken = jwtVerifyForEmailVerification(token) as { id: string; email: string; };

      console.log(verifyToken);

      //update is_Verified status
      const userExists = await this.userRepository.findOneBy({ email: verifyToken.email });

      if (!userExists) {
        throw new Error('User not found');
      }

      if (userExists.is_verified) {
        throw new Error("User is already verified");
      }

      userExists.is_verified = true;
      await this.userRepository.update({ email: verifyToken.email }, userExists);

      return new VerifyUserResDto(`User is verified successfully`);
    } catch (error) {
      throw new Error(`Could not signUp user ${error.message}`);
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