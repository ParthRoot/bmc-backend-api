import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, RoleRepository, RoleAvailableRepository } from 'src/db/repository';
import { UserSignUpReqDto } from './common/dto/req';
import { UserSignUpResDto } from './common/dto/res';
import * as bcrypt from 'bcryptjs';
import { jwtSignForEmailVerification } from 'src/utils';

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly roleAvailableRepository: RoleAvailableRepository
  ) { }

  async userSignUp(userSignUpReqDto: UserSignUpReqDto, roleName): Promise<UserSignUpResDto> {
    try {
      const { email, name, password } = userSignUpReqDto;

      const userExists = await this.userRepository.findOneBy({ email });

      const roleExists = await this.roleAvailableRepository.find({ where: { is_active: true, name: roleName } });

      if (userExists) {
        throw new ConflictException(`email is already exists`);
      }

      if (roleExists.length === 0) {
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
      role.role = roleExists.find((o) => o.name == roleName);
      await this.roleRepository.save(role);

      //create entry in token table

      return new UserSignUpResDto(`user register successfully`);
    } catch (error) {
      console.log(error);
      throw new HttpException(`Could not signUp user ${error.message}`, error.response.statusCode);
    }
  }
}
