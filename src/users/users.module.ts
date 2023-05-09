import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TokenRepository, UserRepository } from 'src/db/repository';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    TokenRepository,
    UserRepository
  ]
})
export class UsersModule { }
