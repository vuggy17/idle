import { FCMTokenRepository } from '../../config/repository';
import { Injectable } from '@nestjs/common';
import { FCMToken } from './type';
import { Timestamp } from 'firebase-admin/firestore';
import { FirebaseProvider } from '../../infra/firebase';
@Injectable()
export class FCMTokenRepositoryImpl implements FCMTokenRepository {
  constructor(private readonly firebase: FirebaseProvider) {}
  async save(
    token: string,
    userId: string,
    lastAccess: number,
  ): Promise<{ userId: string } & FCMToken> {
    const fcmToken = {
      token,
      lastAccess: Timestamp.fromMillis(lastAccess),
    };
    const userTokenRef = this.firebase.db.collection('user-fcm').doc(userId);
    const result = await userTokenRef.update({
      [token]: fcmToken,
    });
    console.log(
      '🚀 ~ file: FCMToken.repository.ts:23 ~ FCMTokenRepositoryImpl ~ result:',
      result,
    );

    return { token, lastAccess, userId };
  }
  saveMany(
    tokens: { token: string; lastAccess: number },
    userId: string,
  ): Promise<{ tokens: FCMToken[]; userId: string }> {
    throw new Error('Method not implemented.');
  }
  async get(userId: string): Promise<{ tokens: FCMToken[]; userId: string }> {
    const userTokenRef = this.firebase.db.collection('user-fcm').doc(userId);
    const tokensRef = await userTokenRef.get();
    if (!tokensRef.exists) {
      return { tokens: [], userId };
    }

    const tokens = Object.values(tokensRef.data()).map((token) => ({
      ...token,
      lastAccess: (token.lastAccess as Timestamp).toMillis(),
    }));
    return { tokens, userId };
  }
}
