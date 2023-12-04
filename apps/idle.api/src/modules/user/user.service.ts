import { Injectable } from '@nestjs/common';
import { AppWriteProvider } from '../appwrite/appwrite.provider';
import { users } from '../../assets/mocks.json';
@Injectable()
export default class UserService {
  constructor(private readonly sdk: AppWriteProvider) {}

  async getSearchSuggestions(q: string) {
    // const r = await this.sdk.users.list([Query.search('name', q)]);
    // fake response
    return Promise.resolve(users.searchSuggestions);
  }

  async getSearchResult(q: string) {
    return Promise.resolve(users.searchResults);
  }

  async getProfile(userId: string) {
    console.log('userId', userId);
    const profile = users.searchResults.find((result) => result.id == userId);
    console.log('profile', profile);
    // console.log(' users.searchResults', users.searchResults);
    return Promise.resolve(profile);
  }
}
