import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { UsersLoginResDto } from './common/dto/res/users.login.response.dto';
import { UserRepository } from 'src/db/repository';
import * as bcrypt from 'bcryptjs';
import { AvailableRoleEnum, jwtSign } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
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
  
      const data = { id: user.id, email: user.email , role: user.role[0].role.name };
      const token = jwtSign(data); 
  
      return new UsersLoginResDto(token);
    } catch (error) {
      console.error('An error occurred while logging in the user: ', error);
      throw new Error(error.message);
    }
  }
}
