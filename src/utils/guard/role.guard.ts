import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AvailableRoleEnum, UserPayload } from './auth.guard';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly role_name: AvailableRoleEnum) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as UserPayload;
        return user.role === this.role_name;
    }
}
