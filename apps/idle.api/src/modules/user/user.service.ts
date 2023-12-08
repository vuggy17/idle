import { Injectable } from '@nestjs/common';
import { users } from '../../assets/mocks.json';
import { UserRepository } from './repository';
@Injectable()
export default class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  async getSearchSuggestions(q: string) {
    return this._userRepository.findMany(q);
  }

  async getSearchResult(q: string) {
    // get users and check if he/she a friend of current user
    return Promise.resolve(users.searchResults);
  }

  async getProfile(userId: string) {
    // get single user and check if he/she a friend of current user
    const profile = users.searchResults.find((result) => result.id == userId);
    return Promise.resolve(profile);
  }
}
