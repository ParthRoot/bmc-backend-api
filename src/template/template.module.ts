import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { RoleAvailableRepository, RoleRepository, SaveTemplateRepository, TemplateRepository, TokenRepository, UserRepository } from 'src/db/repository';


  @Module({
    controllers: [TemplateController],
    providers: [TemplateService, TokenRepository,
      UserRepository,
      RoleRepository,
      RoleAvailableRepository,
      TemplateRepository,
      SaveTemplateRepository]
  })
export class TemplateModule { }
