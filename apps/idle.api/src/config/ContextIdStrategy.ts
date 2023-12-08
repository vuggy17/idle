import { UnauthorizedException } from '@nestjs/common';
import {
  HostComponentInfo,
  ContextId,
  ContextIdFactory,
  ContextIdStrategy,
  ContextIdResolver,
} from '@nestjs/core';
import { Request } from 'express';
import { disposableAppwriteClientProvider } from '../infra/appwrite';
import { HeaderGetter } from '../utils/headerGetter';

const tenants = new Map<string, ContextId>();

export type ContextPayload = {
  jwt: string;
};

/**
 * Attach user's jwt token to create a unique Appwrite client for each user in Request object, see {@linkcode disposableAppwriteClientProvider}, and avoid creating a new dependency tree for each request
 * For more information, see: {@link https://docs.nestjs.com/fundamentals/injection-scopes#durable-providers}
 *
 */
export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
  static removeTenant(tenantID: string) {
    tenants.delete(tenantID);
  }

  attach(contextId: ContextId, request: Request) {
    const userId = HeaderGetter.getUserId(request);
    const jwtToken = HeaderGetter.getBearerToken(request);
    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id in header');
    }
    if (!jwtToken) {
      throw new UnauthorizedException('Missing Bearer token');
    }
    const tenantId = userId;
    let tenantSubTreeId: ContextId;

    if (tenants.has(tenantId)) {
      tenantSubTreeId = tenants.get(tenantId);
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      tenants.set(tenantId, tenantSubTreeId);
    }

    const resolver: ContextIdResolver = {
      resolve: (info: HostComponentInfo) =>
        info.isTreeDurable ? tenantSubTreeId : contextId,
      payload: { tenantId, jwt: jwtToken },
    };
    return resolver;
  }
}
