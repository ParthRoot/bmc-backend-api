import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleAvailableRepository, RoleRepository, TokenRepository, UserRepository } from 'src/db/repository';
import { google } from 'googleapis';
import { getEnv } from 'src/utils';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    TokenRepository,
    UserRepository,
    RoleRepository,
    RoleAvailableRepository,
    {
      provide: 'GOOGLE_AUTH',
      useFactory: () => {
        return new google.auth.OAuth2(
          getEnv('CLIENT_ID'),
          getEnv('SECRET'),
          getEnv('REDIRECT_URL')
        );
      }
    }

  ]
})
export class UsersModule { }
