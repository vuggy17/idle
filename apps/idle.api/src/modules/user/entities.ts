import { Exclude } from 'class-transformer';
import { AppwriteEntity } from '../../config/baseEntity';
import { FriendRequestEntity } from '../friend/entities';

export class UserEntity extends AppwriteEntity {
  name: string;
  email: string;
  avatar: string;
  phone: string;

  @Exclude()
  meta: string;

  @Exclude()
  'friendInvitation-receiver': any;

  @Exclude()
  'friendInvitation-sender': any;

  @Exclude()
  myFriends: any;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

export class UserWithFriendRequestEntity extends UserEntity {
  hasPendingFriendRequest: boolean;
  pendingFriendRequest: FriendRequestEntity;
}
