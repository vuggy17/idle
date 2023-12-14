/* eslint-disable max-classes-per-file */

import { ID } from '@idle/model';
import { Inject } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Query, ID as AppwriteID } from 'node-appwrite';
import { RoomEntity } from './entities';
import {
  AppWriteProvider,
  PersistentAppWriteProvider,
} from '../../infra/appwrite';
import { PrismaProvider } from '../../infra/prisma/prisma.provider';

export abstract class RoomRepository {
  abstract createPrivateRoom(creator: ID, target: ID): Promise<RoomEntity>;
  abstract getMyRooms(myId: ID): Promise<RoomEntity[]>;
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
}
