/* eslint-disable max-classes-per-file */
import { BadRequestException, Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { UserEntity } from '../common/user.entity';
import { PrismaProvider } from '../../infra/prisma/prisma.provider';

export abstract class UserRepository {
  abstract findMany(query: string): Promise<UserEntity[]>;
  abstract getById(id: ID): Promise<UserEntity>;
  abstract getAll(): Promise<UserEntity[]>;
}

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly _prisma: PrismaProvider) {}

  async getById(id: ID): Promise<UserEntity> {
    try {
      const doc = await this._prisma.user.findFirstOrThrow({
        where: {
          id,
        },
      });

      return new UserEntity(doc);
    } catch (error) {
      throw new BadRequestException(`Cannot find user with id: ${id}`);
    }
  }

  async findMany(query: string): Promise<UserEntity[]> {
    const documents = await this._prisma.user.findMany({
      where: {
        meta: {
          contains: query,
        },
      },
    });

    return documents.map((doc) => new UserEntity(doc));
  }

  async getAll(): Promise<UserEntity[]> {
    const documents = await this._prisma.user.findMany();
    return documents.map((doc) => new UserEntity(doc));
  }
}
