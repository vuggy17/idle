/* eslint-disable max-classes-per-file */

import { ID } from '@idle/model';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import { RoomEntity } from './entities';
import {
  AppWriteProvider,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';
import { PrismaProvider } from '../../infra/prisma/prisma.provider';

export abstract class RoomRepository {
  abstract createPrivateRoom(creator: ID, target: ID): Promise<RoomEntity>;
  abstract getMyRooms(myId: ID): Promise<RoomEntity[]>;
  abstract findPrivateRoom(where: {
    memberIds?: ID[];
    roomId?: ID;
  }): Promise<RoomEntity>;
}

export class RoomRepositoryImpl implements RoomRepository {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly appwriteAdmin: AppWriteProvider,

    private readonly _prisma: PrismaProvider,
  ) {}

  async createPrivateRoom(
    creator: string,
    target: string,
  ): Promise<RoomEntity> {
    const doc: RoomEntity = await this._prisma.room.create({
      data: {
        type: 'private',
        members: {
          connect: [
            {
              id: creator,
            },
            {
              id: target,
            },
          ],
        },
      },
      include: {
        members: true,
      },
    });

    return new RoomEntity(doc);
  }

  async getMyRooms(myId: string): Promise<RoomEntity[]> {
    const documents: RoomEntity[] = await this._prisma.room.findMany({
      where: {
        members: {
          some: {
            id: myId,
          },
        },
      },
      include: {
        members: true,
      },
    });
    return documents.map((doc) => new RoomEntity(doc));
  }

  async findPrivateRoom(where: {
    memberIds?: string[];
    roomId?: string;
  }): Promise<RoomEntity> {
    const { memberIds, roomId } = where;
    let room: RoomEntity;

    if (!memberIds && !roomId) {
      throw new InternalServerErrorException(
        'Cannot query room without roomId or memberIds',
      );
    }

    if (roomId) {
      room = await this._prisma.room.findFirstOrThrow({
        where: {
          id: roomId,
        },
        include: {
          members: true,
        },
      });
    }
    if (memberIds) {
      room = await this._prisma.room.findFirstOrThrow({
        where: {
          members: {
            every: {
              id: {
                in: memberIds,
              },
            },
          },
        },
        include: {
          members: true,
        },
      });
    }

    return new RoomEntity(room);
  }
}
