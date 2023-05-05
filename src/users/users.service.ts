import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository, RoleRepository, RoleAvailableRepository } from 'src/db/repository';
import { UserSignUpReqDto } from './common/dto/req';
import { UserSignUpResDto } from './common/dto/res';
import * as bcrypt from 'bcryptjs';

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

      const userExists = await this.userRepository.find({ where: { email } });

      const roleExists = await this.roleAvailableRepository.find({ where: { is_active: true, name: roleName } });

      if (userExists.length != 0) {
        throw new ConflictException(`email is already exists`);
      }

      if (roleExists.length === 0) {
        throw new NotFoundException(`${roleName} does not exists`);
      }

      //hash
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({ email, name, password_hash });
      const savedUser = await this.userRepository.save(user);

      const role = await this.roleRepository.create();
      role.user = savedUser;
      role.role = roleExists.find((o) => o.name == roleName);
      await this.roleRepository.save(role);

      return new UserSignUpResDto(`user register successfully`);
    } catch (error) {
      throw new HttpException(`Could not signUp user ${error.message}`, error.response.statusCode);
    }
  }
}
