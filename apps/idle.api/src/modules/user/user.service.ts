import { Injectable } from '@nestjs/common';
import { ID } from '@idle/model';
import { instanceToPlain } from 'class-transformer';
import { FriendRepository } from '../friend/repository';
import { UserRepository } from './repository';
import { UserEntity } from '../common/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _friendRepository: FriendRepository,
  ) {}

  async getSearchSuggestions(q: string) {
    return this._userRepository.findMany(q);
  }

  async getSearchResult(q: string, loggedInUserId: ID) {
    // get users and check if he/she a friend of current user
    let users: UserEntity[];
    if (q.length === 0) {
      users = await this._userRepository.getAll();
    } else {
      users = await this._userRepository.findMany(q);
    }

    // exclude self
    users = users.filter((user) => user.id !== loggedInUserId);

    if (users.length === 0) {
      return [];
    }

    const userIds = users.map((user) => user.id);
    const friends = await this._friendRepository.getFriendsOf(userIds);
    const friendRequests =
      await this._friendRepository.getFriendRequestsBySender(
        [...userIds, loggedInUserId],
        'pending',
      );

    const results = users.map((user) => {
      const temp = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        bio: 'wait for implement',
      };

      const currentUserFriendList = friends.find(
        (entity) => entity.user.id === user.id,
      );

      const isFriend = currentUserFriendList?.friends.some(
        (friend) => friend.id === loggedInUserId,
      );

      // neu da la friend roi thi khong can check friend request nua
      if (isFriend) {
        return {
          ...temp,
          isFriend: true,
          hasPendingRequest: false,
          pendingFriendRequest: null,
        };
      }

      // neu khong phai friend thi tim xem co friend request dang pending khong
      const request = friendRequests.find(
        (entity) =>
          (entity.sender.id === user.id &&
            entity.receiver.id === loggedInUserId) ||
          (entity.sender.id === loggedInUserId &&
            entity.receiver.id === user.id),
      );
      return {
        ...temp,
        isFriend: false,
        hasPendingRequest: Boolean(request),
        pendingFriendRequest: request || null,
      };
    });

    return results;
  }

  /**
   * same logic with {@linkcode getSearchResult} but operate on single user
   * @param id user to get profile
   * @param loggedInUserId current user who want to get another profile
   */
  async getProfile(id: ID, loggedInUserId: ID) {
    // get users and check if he/she a friend of current user
    const user = await this._userRepository.getById(id);
    const userId = user.id;
    const friends = await this._friendRepository.getFriendsOf([userId]);

    const isFriend = friends.find(
      (record) =>
        record.user.id === userId &&
        record.friends.some((friend) => friend.id === loggedInUserId),
    );

    if (isFriend) {
      return {
        ...instanceToPlain(user),
        isFriend: true,
        hasPendingRequest: false,
        pendingFriendRequest: null,
      };
    }

    // find friend request if existed
    const friendRequests =
      await this._friendRepository.getFriendRequestsBySender(
        [userId],
        'pending',
      );

    const request = friendRequests.find(
      (rq) => rq.receiver.id === loggedInUserId,
    );
    if (request) {
      return {
        ...instanceToPlain(user),
        isFriend: false,
        hasPendingRequest: true,
        pendingFriendRequest: instanceToPlain(request),
      };
    }
    return {
      ...instanceToPlain(user),
      isFriend: false,
      hasPendingRequest: false,
      pendingFriendRequest: null,
    };
  }
}
