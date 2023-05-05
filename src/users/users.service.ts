/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/db/repository';
import { UserSignUpReqDto } from './common/dto/req/index';
import { UserSignUpResDto } from './common/dto/res/index';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(private readonly userRepository: UserRepository) { }

  async userSignUp(userSignUpReqDto: UserSignUpReqDto): Promise<UserSignUpResDto> {
    try {
      console.log(userSignUpReqDto);

      const { email, name, password } = userSignUpReqDto;

      const userExists = await this.userRepository.findOneBy({ email });

      if (userExists) {
        throw new Error('User with that email is already exists');
      }

      //hash
      const salt = await bcrypt.genSalt();

      const password_hash = await bcrypt.hash(password, salt);

      return new UserSignUpResDto(userSignUpReqDto, "User Register");
    } catch (error) {
      throw new Error(`Could not signUp User ${error.message}`);
    }
  }
}
