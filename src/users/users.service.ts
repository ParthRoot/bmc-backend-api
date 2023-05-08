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
    const { email, password } = userLogin;
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (!user.is_verified) {
        throw new HttpException('User is not verified', HttpStatus.CONFLICT);
      }
      if (!user.is_active) {
        throw new HttpException('User is not active, please contact admin', HttpStatus.CONFLICT);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new HttpException('Please enter correct password', HttpStatus.UNAUTHORIZED);
      }
      const data = { id: user.id, email: user.email , role: AvailableRoleEnum.NORMAL };
      const token = jwtSign(data); 
      return new UsersLoginResDto(token);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
