import { Request } from 'express';

export const HeaderGetter = {
  getBearerToken: (request: Request): string | undefined => {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  },
  getUserId: (request: Request): string | undefined => {
    const userId = request.headers['x-user-id'] as string;
    return userId;
  },
};
