import { Type } from 'class-transformer';
import { CockroachEntity } from '../../config/baseEntity';
import { UserEntity } from '../common/user.entity';

export class RoomEntity extends CockroachEntity {
  @Type(() => UserEntity)
  members: UserEntity[];

  type: string;

  constructor(partial: Partial<RoomEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
