/* eslint-disable max-classes-per-file */
import { Inject } from '@nestjs/common';
import { Query } from 'node-appwrite';
import {
  PersistentAppWriteProvider,
  AppWriteProvider,
} from '../../infra/appwrite';
import { UserEntity } from './entities';

export abstract class UserRepository {
  abstract findMany(query: string): Promise<UserEntity[]>;
}

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @Inject(PersistentAppWriteProvider)
    private readonly appwriteAdmin: AppWriteProvider,
  ) {}

  async findMany(query: string): Promise<UserEntity[]> {
    const result = await this.appwriteAdmin.database.listDocuments<UserEntity>(
      AppWriteProvider.defaultDatabaseId,
      AppWriteProvider.projectDbCollections.chat.user,
      [Query.search('meta', query)],
    );

    return result.documents;
  }
}
