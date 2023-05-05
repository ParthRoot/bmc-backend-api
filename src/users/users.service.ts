import { Injectable } from '@nestjs/common';
import { UsersLoginReqDto } from './common/dto/req/users.login.request.dto';
import { UsersLoginResDto } from './common/dto/res/users.login.response.dto';
import { UserRepository } from 'src/db/repository';
import * as bcrypt from 'bcryptjs';
import { RoleAvailableEntity, UserEntity } from 'src/db/entity';
import { AvailableRoleEnum, RoleGuard } from 'src/utils';


@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async loginUser(userLogin : UsersLoginReqDto) : Promise<UsersLoginResDto>{
    const { email, password } = userLogin;
    try{
      const user = await this.userRepository.findOneBy({
        email,
        is_active: true,
      })
      if(user){
        const userid = user.id;
        if(user && (await bcrypt.compare(password, user.password_hash)))
        // const role =  
      }
    }
    catch(error){

    }
  }

}
