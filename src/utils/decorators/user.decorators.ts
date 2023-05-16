import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserPayload } from '../guard';
import { UnautherizationError } from '../error';

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) throw new UnautherizationError(`User is not provided.`);
    return request.user as UserPayload;
});