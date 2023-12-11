import { ValueOf } from '@idle/typing';
import { Type } from 'class-transformer';
import { UserEntity } from './user.entity';
import { AppwriteEntity } from '../../config/baseEntity';
import { FriendRequestStatus } from '../friend/entities';

/**
 * This should match {@linkcode CreateFriendRequestResponseDTO}
 */

export class FriendRequestEntity extends AppwriteEntity {
  status: ValueOf<typeof FriendRequestStatus>;

  @Type(() => UserEntity)
  sender: UserEntity;

  @Type(() => UserEntity)
  receiver: UserEntity;

  constructor(partial: Partial<FriendRequestEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
