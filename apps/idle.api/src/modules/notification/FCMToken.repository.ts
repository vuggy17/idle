import { FirebaseProvider } from '../firebase/firebase.provider';
import { FCMTokenRepository } from '../../config/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FCMTokenRepositoryImpl implements FCMTokenRepository {
  constructor(private readonly firebase: FirebaseProvider) {}
  save(
    token: string,
    userId: string,
  ): Promise<{ token: string[]; userId: string }> {
    throw new Error('Method not implemented.');
  }

  saveMany(
    tokens: string[],
    userId: string,
  ): Promise<{ token: string[]; userId: string }> {
    throw new Error('Method not implemented.');
  }

  async get(userId: string): Promise<{ token: string[]; userId: string }> {
    const collection = this.firebase.db.collection('user-fcm');
    const snapshot = await collection.where('id', '==', 'admin').get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    const result = snapshot.docs.map((doc) => doc.data().tokens);
    console.log(
      '🚀 ~ file: FCMToken.repository.ts:31 ~ FCMTokenRepositoryImpl ~ get ~ result:',
      result,
    );

    return { token: [], userId };
  }
}
