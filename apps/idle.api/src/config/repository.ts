import { ID } from '@idle/model';

export interface FCMTokenRepository {
  save(
    token: string,
    userId: string,
  ): Promise<{ token: string[]; userId: string }>;

  saveMany(
    tokens: string[],
    userId: string,
  ): Promise<{ token: string[]; userId: string }>;

  get(userId: ID): Promise<{ token: string[]; userId: ID }>;
}
