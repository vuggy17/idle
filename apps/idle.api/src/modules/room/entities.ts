import { Type } from 'class-transformer';
import { ID } from '@idle/model';
import { CockroachEntity } from '../../config/baseEntity';
import { UserEntity } from '../common/user.entity';

export class RoomEntity extends CockroachEntity {
  @Type(() => UserEntity)
  members: UserEntity[];

  type: ID;

  constructor(partial: Partial<RoomEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
