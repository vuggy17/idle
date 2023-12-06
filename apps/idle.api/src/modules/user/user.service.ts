import { Inject, Injectable } from '@nestjs/common';
import { users } from '../../assets/mocks.json';
import {
  DisposableAppWriteClient,
  AppWriteProvider,
} from '../../infra/appwrite';
@Injectable()
export default class UserService {
  constructor(
    @Inject(DisposableAppWriteClient) private readonly sdk: AppWriteProvider,
  ) {}

  async getSearchSuggestions(q: string) {
    return Promise.resolve(users.searchSuggestions);
  }

  async getSearchResult(q: string) {
    return Promise.resolve(users.searchResults);
  }

  async getProfile(userId: string) {
    const profile = users.searchResults.find((result) => result.id == userId);
    return Promise.resolve(profile);
  }
}
