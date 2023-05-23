import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ormConfig } from 'src/db';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TemplateModule } from 'src/template/template.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useFactory: () => ormConfig }),
    UsersModule,
    TemplateModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
