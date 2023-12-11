/* eslint-disable max-classes-per-file */
import { ID } from '@idle/model';
import { Inject } from '@nestjs/common';
import { ID as AppwriteID, Query } from 'node-appwrite';
import { FriendEntity, FriendRequestStatusType } from './entities';
import { FriendRequestEntity } from '../common/friend.entity';
import {
  AppWriteProvider,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';

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
  /**
   * Get friends of multiple users:
   * @return {Record<string, FriendEntity>}: [userId - their friends]
   */
  abstract getFriends(userIds: ID[]): Promise<FriendEntity[]>;
}

export class FriendRepositoryImpl implements FriendRepository {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly _appwriteAdmin: AppWriteProvider,
  ) {}

  // friend
  // eslint-disable-next-line class-methods-use-this
  addFriend(requester: ID, recipient: ID): Promise<FriendEntity> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
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
    return documents.map((doc) => new FriendEntity(doc));
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

    return new FriendRequestEntity(request);
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
    }
    return documents.map((doc) => new FriendRequestEntity(doc));
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
    return new FriendRequestEntity(doc);
  }

  async getFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity | null> {
    const { total, documents } =
      await this._appwriteAdmin.database.listDocuments<FriendRequestEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.friendInvitation,
        [Query.equal('receiver', receiver), Query.equal('sender', sender)],
      );

    if (total === 0) {
      return null;
    }
    return new FriendRequestEntity(documents[0]);
  }
}
