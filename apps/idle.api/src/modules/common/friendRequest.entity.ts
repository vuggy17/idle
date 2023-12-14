import { ValueOf } from '@idle/typing';
import { Exclude, Type } from 'class-transformer';
import { ID } from '@idle/model';
import { UserEntity } from './user.entity';
import { CockroachEntity } from '../../config/baseEntity';
import { FriendRequestStatus } from '../friend/entities';

/**
 * This should match {@linkcode CreateFriendRequestResponseDTO}
 */

export class FriendRequestEntity extends CockroachEntity {
  status: ValueOf<typeof FriendRequestStatus>;

  @Exclude()
  senderId: ID;

  @Exclude()
  receiverId: ID;

  @Type(() => UserEntity)
  sender: UserEntity;

  @Type(() => UserEntity)
  receiver: UserEntity;

  constructor(partial: Partial<FriendRequestEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
