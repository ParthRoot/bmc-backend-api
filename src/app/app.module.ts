import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ormConfig } from 'src/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => ormConfig }),
    UsersModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
