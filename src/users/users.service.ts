import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { UsersLoginResDto } from './common/dto/res/users.login.response.dto';
import { UserRepository } from 'src/db/repository';
import * as bcrypt from 'bcryptjs';
import { AvailableRoleEnum, UnautherizationError, UserPayload } from 'src/utils';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService) {}
  async loginUser(userLogin: UsersLoginReqDto): Promise<UsersLoginResDto> {
    const { email, password } = userLogin;
    const key = process.env.JWT_SECRET_KEY;
    try {
      const user = await this.userRepository.findOneBy({
        email,
        is_active: true,
        is_verified: true,
      });
      if (user) {
        if (await bcrypt.compare(password, user.password_hash)) {
          const payload: UserPayload = { id: user.id, email, role: AvailableRoleEnum.NORMAL };
          const token: string = await this.jwtService.signAsync({ payload }, { secret: key });
          return new UsersLoginResDto(token);
        } else {
          throw new UnauthorizedException('please enter correct password')
        }
      } else {
        throw new NotFoundException("User not found");
      }
    } catch (error) {
      console.log("Errror", error.response.statusCode);
      throw new HttpException(`${error.message}`, error.response.statusCode);
    }
  }

}
