import { ValueOf } from '@idle/typing';
import { UserEntity } from '../common/user.entity';
import { AppwriteEntity } from '../../config/baseEntity';

export const FriendRequestStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',
} as const;

export type FriendRequestStatusType = ValueOf<typeof FriendRequestStatus>;

export class FriendEntity extends AppwriteEntity {
  user: UserEntity;

  friends: UserEntity[];

  constructor(partial: Partial<FriendEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
