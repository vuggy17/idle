import { ValueOf } from '@idle/typing';
import { UserEntity } from './user.entity';
import { AppwriteEntity } from '../../config/baseEntity';
import { FriendRequestStatus } from '../friend/entities';

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
