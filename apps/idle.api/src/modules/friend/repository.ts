/* eslint-disable max-classes-per-file */
import { ID } from '@idle/model';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FriendEntity, FriendRequestStatusType } from './entities';
import { FriendRequestEntity } from '../common/friendRequest.entity';
import { UserEntity } from '../common/user.entity';
import { PrismaProvider } from '../../infra/prisma/prisma.provider';

// Interface isn't a injection token in runtime,
// https://stackoverflow.com/a/74561702/14668586
export abstract class FriendRepository {
  // #region friend requests
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
  abstract findFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity>;
  abstract getFriendRequest(requestId: ID): Promise<FriendRequestEntity>;
  abstract getFriendRequestsByReceiver(
    receiver: ID,
    status?: FriendRequestStatusType,
  ): Promise<FriendRequestEntity[]>;
  // #endregion

  // #region friend
  abstract addFriend(requester: ID, recipient: ID): Promise<FriendEntity>;
  abstract removeFriend(requester: ID, recipient: ID): Promise<FriendEntity>;
  /**
   * Get friends of multiple users:
   * @return {Record<string, FriendEntity>}: [userId - their friends]
   */
  abstract getFriendsOf(userIds: ID[]): Promise<FriendEntity[]>;
  abstract findFriendByName(he: ID, name: string): Promise<UserEntity[]>;
  // #endregion
}

@Injectable()
export class FriendRepositoryImpl implements FriendRepository {
  constructor(private readonly _prisma: PrismaProvider) {}

  // friend
  async addFriend(requester: ID, recipient: ID): Promise<FriendEntity> {
    const doc: FriendEntity = await this._prisma.userFriend.findFirstOrThrow({
      where: {
        userId: requester,
      },
    });

    const friendIds =
      doc.friends?.map((u) => ({
        id: u.id,
      })) ?? [];

    const result = this._prisma.userFriend.update({
      where: {
        userId: requester,
      },
      data: {
        friends: {
          connect: [
            ...friendIds,
            {
              id: recipient,
            },
          ],
        },
      },
    });
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  removeFriend(requester: ID, recipient: ID): Promise<FriendEntity> {
    throw new Error('Method not implemented.');
  }

  async getFriendsOf(userIds: ID[]): Promise<FriendEntity[]> {
    const documents = await this._prisma.userFriend.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      include: {
        user: true,
        friends: true,
      },
    });
    return documents.map((doc) => new FriendEntity(doc));
  }

  // friend request
  async createFriendRequest(
    sender: string,
    receiver: string,
  ): Promise<FriendRequestEntity> {
    const request: FriendRequestEntity =
      await this._prisma.friendInvitation.create({
        data: {
          status: 'pending',
          receiver: {
            connect: {
              id: receiver,
            },
          },
          sender: {
            connect: {
              id: sender,
            },
          },
        },
        include: {
          receiver: true,
          sender: true,
        },
      });

    return new FriendRequestEntity(request);
  }

  async getFriendRequestsBySender(
    sender: ID[],
    status: FriendRequestStatusType,
  ): Promise<FriendRequestEntity[]> {
    const documents: FriendRequestEntity[] =
      await this._prisma.friendInvitation.findMany({
        where: {
          senderId: {
            in: sender,
          },
          status,
        },
        include: {
          receiver: true,
          sender: true,
        },
      });
    return documents.map((doc) => new FriendRequestEntity(doc));
  }

  async updateFriendRequestStatus(
    docId: ID,
    updates: { status: FriendRequestStatusType },
  ): Promise<FriendRequestEntity> {
    const doc = await this._prisma.friendInvitation.update({
      where: {
        id: docId,
      },
      data: {
        status: updates.status,
      },
      include: {
        receiver: true,
        sender: true,
      },
    });
    return new FriendRequestEntity(doc);
  }

  async findFriendRequest(
    sender: ID,
    receiver: ID,
  ): Promise<FriendRequestEntity | null> {
    try {
      const doc: FriendRequestEntity =
        await this._prisma.friendInvitation.findFirstOrThrow({
          where: {
            senderId: sender,
            receiverId: receiver,
          },
          include: {
            sender: true,
            receiver: true,
          },
        });

      return new FriendRequestEntity(doc);
    } catch (error) {
      return null;
    }
  }

  async getFriendRequest(requestId: string): Promise<FriendRequestEntity> {
    try {
      const doc: FriendRequestEntity =
        await this._prisma.friendInvitation.findFirstOrThrow({
          where: {
            id: requestId,
          },
          include: {
            receiver: true,
            sender: true,
          },
        });

      return new FriendRequestEntity(doc);
    } catch (error) {
      throw new NotFoundException(`No request found`);
    }
  }

  async getFriendRequestsByReceiver(
    receiver: string,
    status?: FriendRequestStatusType,
  ): Promise<FriendRequestEntity[]> {
    const documents: FriendRequestEntity[] =
      await this._prisma.friendInvitation.findMany({
        where: {
          status,
          receiverId: receiver,
        },
        include: {
          receiver: true,
          sender: true,
        },
      });

    return documents.map((doc) => new FriendRequestEntity(doc));
  }

  async findFriendByName(self: ID, name: string): Promise<UserEntity[]> {
    const me = await this._prisma.userFriend.findFirst({
      where: {
        userId: self,
      },
      include: {
        friends: true,
      },
    });

    if (me === null) {
      throw new InternalServerErrorException(
        'You forgot to seed user friend on user create!',
      );
    }

    const friends = me.friends.map((user) => user.id);
    const users: UserEntity[] = await this._prisma.user.findMany({
      where: {
        id: {
          in: friends,
        },
        name: {
          contains: name,
        },
      },
    });

    return users.map((u) => new UserEntity(u));
  }
}
