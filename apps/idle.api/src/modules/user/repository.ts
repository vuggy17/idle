/* eslint-disable max-classes-per-file */
import { Inject } from '@nestjs/common';
import { Query } from 'node-appwrite';
import { ID } from '@idle/model';
import {
  PersistentAppWriteProvider,
  AppWriteProvider,
} from '../../infra/appwrite';
import { UserEntity } from '../common/user.entity';

export abstract class UserRepository {
  abstract findMany(query: string): Promise<UserEntity[]>;
  abstract getById(id: ID): Promise<UserEntity>;
  abstract getAll(): Promise<UserEntity[]>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly appwriteAdmin: AppWriteProvider,
  ) {}

  async getById(id: ID): Promise<UserEntity> {
    const doc = await this.appwriteAdmin.database.getDocument<UserEntity>(
      AppWriteProvider.defaultDatabaseId,
      AppWriteProvider.projectDbCollections.chat.user,
      id,
    );

    return new UserEntity(doc);
  }

  async findMany(query: string): Promise<UserEntity[]> {
    const { documents } =
      await this.appwriteAdmin.database.listDocuments<UserEntity>(
        AppWriteProvider.defaultDatabaseId,
        AppWriteProvider.projectDbCollections.chat.user,
        [Query.search('meta', query)],
      );

    return documents.map((doc) => new UserEntity(doc));
  }

  async getAll(): Promise<UserEntity[]> {
    const doc = await this.appwriteAdmin.database.listDocuments<UserEntity>(
      AppWriteProvider.defaultDatabaseId,
      AppWriteProvider.projectDbCollections.chat.user,
    );

    return doc.documents.map((doc) => new UserEntity(doc));
  }
}
