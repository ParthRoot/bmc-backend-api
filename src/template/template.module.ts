import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { RoleAvailableRepository, RoleRepository, TokenRepository, UserRepository } from 'src/db/repository';
import { SaveTemplateRepository, TemplateRepository } from 'src/db/repository/template';


@Module({
  controllers: [TemplateController],
  providers: [TemplateService, TokenRepository,
    UserRepository,
    RoleRepository,
    RoleAvailableRepository,
    TemplateRepository,
    SaveTemplateRepository
  ]
})
export class TemplateModule { }
