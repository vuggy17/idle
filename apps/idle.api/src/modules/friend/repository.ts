import { ID } from '@idle/model';
import { FriendRequestEntity, FriendRequestStatusType } from './entities';
import { Inject } from '@nestjs/common';
import {
  AppWriteProvider,
  DisposableAppWriteClient,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';
import { ID as AppwriteID, Query } from 'node-appwrite';

// Interface isn't a injection token in runtime,
// https://stackoverflow.com/a/74561702/14668586
export abstract class FriendRequestRepository {
  abstract create(sender: ID, receiver: ID): Promise<FriendRequestEntity>;
  abstract update(
    docId: ID,
    updates: { status: FriendRequestStatusType },
  ): Promise<FriendRequestEntity>;
  abstract findExisted(sender: ID, receiver: ID): Promise<string | null>;
}

export class FriendRequestRepositoryImpl implements FriendRequestRepository {
  constructor(
    @Inject(DisposableAppWriteClient)
    private readonly appwrite: AppWriteProvider,
    @Inject(PersistentAppWriteProvider)
    private readonly appwriteAdmin: AppWriteProvider,
  ) {}

  async create(sender: string, receiver: string): Promise<FriendRequestEntity> {
    const request =
      await this.appwriteAdmin.database.createDocument<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        AppwriteID.unique(),
        { sender, receiver },
      );

    return request;
  }

  async findExisted(sender: ID, receiver: ID): Promise<string | null> {
    const { total, documents } =
      await this.appwriteAdmin.database.listDocuments(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        [Query.equal('sender', sender), Query.equal('receiver', receiver)],
      );

    if (total === 0) {
      return null;
    } else {
      return documents[0].$id;
    }
  }

  async update(
    docId: ID,
    updates: { status: FriendRequestStatusType },
  ): Promise<FriendRequestEntity> {
    const doc =
      await this.appwriteAdmin.database.updateDocument<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        docId,
        updates,
      );
    return doc;
  }
}
