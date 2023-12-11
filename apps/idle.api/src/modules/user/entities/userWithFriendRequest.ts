import { FriendRequestEntity } from '../../common/friend.entity';
import { UserEntity } from '../../common/user.entity';

export class UserWithFriendRequestEntity extends UserEntity {
  hasPendingFriendRequest: boolean;

  pendingFriendRequest: FriendRequestEntity;
}
