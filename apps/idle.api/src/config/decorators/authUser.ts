import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppWriteUserEntity } from '../../modules/common/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AppWriteUserEntity;
  },
);
