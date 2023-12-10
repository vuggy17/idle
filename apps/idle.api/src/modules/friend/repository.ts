import { ID } from '@idle/model';
import {
  FriendEntity,
  FriendRequestEntity,
  FriendRequestStatusType,
} from './entities';
import { Inject } from '@nestjs/common';
import {
  AppWriteProvider,
  DisposableAppWriteClient,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';
import { ID as AppwriteID, Query } from 'node-appwrite';

// Interface isn't a injection token in runtime,
// https://stackoverflow.com/a/74561702/14668586
export abstract class FriendRepository {
  // friend requests
  abstract createFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity>;
  abstract updateFriendRequestStatus(
    docId: ID,
    updates: { status: FriendRequestStatusType },
  ): Promise<FriendRequestEntity>;
  abstract getFriendRequestsBySender(
    senders: ID[],
    status: FriendRequestStatusType,
  ): Promise<FriendRequestEntity[]>;
  abstract getFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity>;

  // friend
  abstract addFriend(requester: ID, recipient: ID): Promise<FriendEntity>;
  abstract removeFriend(requester: ID, recipient: ID): Promise<FriendEntity>;
  abstract getFriends(userIds: ID[]): Promise<FriendEntity[]>;
}

export class FriendRepositoryImpl implements FriendRepository {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly _appwriteAdmin: AppWriteProvider,
  ) {}

  // friend
  addFriend(requester: ID, recipient: ID): Promise<FriendEntity> {
    throw new Error('Method not implemented.');
  }
  removeFriend(requester: ID, recipient: ID): Promise<FriendEntity> {
    throw new Error('Method not implemented.');
  }
  async getFriends(userIds: ID[]): Promise<FriendEntity[]> {
    const { total, documents } =
      await this._appwriteAdmin.database.listDocuments<FriendEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friend,
        [Query.equal('user', userIds)],
      );

    if (total === 0) {
      return [];
    }
    return documents;
  }

  // friend request
  async createFriendRequest(
    sender: string,
    receiver: string,
  ): Promise<FriendRequestEntity> {
    const request =
      await this._appwriteAdmin.database.createDocument<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        AppwriteID.unique(),
        { sender, receiver },
      );

    return request;
  }

  async getFriendRequestsBySender(
    sender: ID[],
    status: FriendRequestStatusType,
  ): Promise<FriendRequestEntity[]> {
    const { total, documents } =
      await this._appwriteAdmin.database.listDocuments<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        [Query.equal('sender', sender), Query.equal('status', status)],
      );

    if (total === 0) {
      return [];
    } else {
      return documents;
    }
  }

  async updateFriendRequestStatus(
    docId: ID,
    updates: { status: FriendRequestStatusType },
  ): Promise<FriendRequestEntity> {
    const doc =
      await this._appwriteAdmin.database.updateDocument<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        docId,
        updates,
      );
    return doc;
  }

  async getFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity> {
    const { total, documents } =
      await this._appwriteAdmin.database.listDocuments<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        [Query.equal('receiver', receiver), Query.equal('sender', sender)],
      );

    if (total === 0) {
      return null;
    } else {
      return documents[0];
    }
  }
}
