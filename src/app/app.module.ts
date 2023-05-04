import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ormConfig } from 'src/db';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => ormConfig }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
