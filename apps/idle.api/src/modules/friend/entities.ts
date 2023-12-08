import { CreateFriendRequestResponseDTO } from '@idle/model';
import { ValueOf } from '@idle/typing';
import { UserEntity } from '../user';
import { AppwriteEntity } from '../../config/baseEntity';

export const FriendRequestStatus = {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  cancelled: 'cancelled',
} as const;

export type FriendRequestStatusType = ValueOf<typeof FriendRequestStatus>;

/**
 * This should match {@linkcode CreateFriendRequestResponseDTO}
 */
export class FriendRequestEntity extends AppwriteEntity {
  status: ValueOf<typeof FriendRequestStatus>;
  sender: UserEntity;
  receiver: UserEntity;

  constructor(partial: Partial<FriendRequestEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
