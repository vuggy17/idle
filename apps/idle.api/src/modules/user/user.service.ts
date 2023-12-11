/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
// import { UserRepository } from './repository';
import { ID } from '@idle/model';
import { FriendRepository } from '../friend/repository';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: any,
    private readonly _friendRepository: FriendRepository,
  ) {}

  async getSearchSuggestions(q: string) {
    return this._userRepository.findMany(q);
  }

  // TODO: add pagination
  async getSearchResult(q: string, loggedInUserId: ID) {
    // get users and check if he/she a friend of current user
    const users = await this._userRepository.findMany(q);
    if (users.length === 0) {
      return [];
    }

    const userIds = users.map((user) => user.$id);
    const friends = await this._friendRepository.getFriends(userIds);
    const friendRequests =
      await this._friendRepository.getFriendRequestsBySender(
        userIds,
        'pending',
      );

    const results = users.map((user) => {
      const temp = {
        id: user.$id,
        name: user.name,
        avatar: user.avatar,
        bio: 'wait for implement',
      };

      const currentUserFriendList = friends.find(
        (entity) => entity.user.$id === user.$id,
      );

      const isFriend = currentUserFriendList.friends.some(
        (friend) => friend.$id === user.$id,
      );

      // neu da la friend roi thi khong can check friend request nua
      if (isFriend) {
        return {
          ...temp,
          hasPendingRequest: false,
          pendingFriendRequest: null,
        };
      }
      const request = friendRequests.find(
        (entity) =>
          entity.sender.$id === user.$id &&
          entity.receiver.$id === loggedInUserId,
      );
      return {
        ...temp,
        hasPendingRequest: Boolean(request),
        pendingFriendRequest: request || null,
      };
    });

    return results;

    // return Promise.resolve(users.searchResults);
  }

  async getProfile(userId: string) {
    // get single user and check if he/she a friend of current user
    // const profile = users.searchResults.find((result) => result.id == userId);
    // return Promise.resolve(profile);
    return {};
  }
}

/**
 * Promise<{
   id: ID;
  name: string;
  avatar: string;
  bio: string;
  isFriend: boolean;
  hasPendingRequest: boolean;

  pendingFriendRequest: FriendRequestEntity | null;
}[]>
 */
