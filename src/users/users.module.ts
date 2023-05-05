import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleAvailableRepository, RoleRepository, UserRepository } from 'src/db/repository';


@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, RoleRepository, RoleAvailableRepository],
})
export class UsersModule { }
