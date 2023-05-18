import { Injectable } from '@nestjs/common';
import { TokenRepository, UserRepository, RoleRepository, RoleAvailableRepository } from 'src/db/repository';

@Injectable()
export class TemplateService {
    constructor(private readonly tokenRepository: TokenRepository,
        private readonly userRepository: UserRepository,
        private readonly roleRepository: RoleRepository,
        private readonly roleAvailableRepository: RoleAvailableRepository,) { }


    tempTemplate() {
        return "Hello This is template service";
    }
}
