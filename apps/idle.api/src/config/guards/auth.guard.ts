import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  AppWriteProvider,
  DisposableAppWriteClient,
} from '../../infra/appwrite';
import { HeaderGetter } from '../../utils/headerGetter';
import { AggregateByTenantContextIdStrategy } from '../ContextIdStrategy';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(DisposableAppWriteClient)
    private readonly appwrite: AppWriteProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = HeaderGetter.getBearerToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.appwrite.account.get();
      request['user'] = payload;
    } catch (error) {
      if ('type' in error && error.type === 'user_jwt_invalid') {
        const userId = HeaderGetter.getUserId(request);
        AggregateByTenantContextIdStrategy.removeTenant(userId);
        throw new UnauthorizedException(error);
      }
      throw new UnauthorizedException();
    }
    return true;
  }
}
