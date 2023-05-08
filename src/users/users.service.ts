import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, RoleRepository, RoleAvailableRepository, TokenRepository } from 'src/db/repository';
import { UserSignUpReqDto } from './common/dto/req';
import { UserSignUpResDto } from './common/dto/res';
import * as bcrypt from 'bcryptjs';
import { jwtSignForEmailVerification } from 'src/utils';
import { TokenType } from 'src/db/entity';
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
        throw new ConflictException(`email is already exists`);
      }

      if (!roleExists) {
        throw new NotFoundException(`${roleName} does not exists`);
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
      throw new HttpException(`Could not signUp user ${error.message}`, error.response.statusCode);
    }
  }
}
