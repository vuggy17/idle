import { ID, TIME } from '@idle/model';
import { FCMToken } from '../modules/notification/type';

export interface FCMTokenRepository {
  save(
    token: string,
    userId: string,
    lastAccess: TIME,
  ): Promise<{ userId: string } & FCMToken>;

  saveMany(
    tokens: {
      token: string;
      lastAccess: TIME;
    },
    userId: string,
  ): Promise<{ tokens: FCMToken[]; userId: ID }>;

  get(userId: ID): Promise<{ tokens: FCMToken[]; userId: ID }>;
}
