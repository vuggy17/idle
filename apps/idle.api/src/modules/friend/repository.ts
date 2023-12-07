import { ID } from '@idle/model';
import { FriendRequest } from './entities';
import { Inject } from '@nestjs/common';
import {
  AppWriteProvider,
  DisposableAppWriteClient,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';
import { Query } from 'node-appwrite';

// Interface isn't a injection token in runtime,
// https://stackoverflow.com/a/74561702/14668586
export abstract class FriendRepository {
  abstract createFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequest>;
}

export class FriendRepositoryImpl implements FriendRepository {
  constructor(
    @Inject(DisposableAppWriteClient)
    private readonly appwrite: AppWriteProvider,
    @Inject(PersistentAppWriteProvider)
    private readonly appwriteAdmin: AppWriteProvider,
  ) {}
  async createFriendRequest(
    sender: string,
    receiver: string,
  ): Promise<FriendRequest> {
    const oldRequest = await this.appwriteAdmin.database.listDocuments(
      AppWriteProvider.defaultDatabaseId,
      AppWriteProvider.projectDbCollections.chat.friendInvitation,
      [Query.equal('sender', sender), Query.equal('receiver', receiver)],
    );

    console.log('oldRequest', oldRequest);
    throw new Error('Method not implemented.');
  }
}
