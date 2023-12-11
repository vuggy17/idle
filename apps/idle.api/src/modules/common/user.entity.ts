import { Exclude } from 'class-transformer';
import { AppwriteEntity } from '../../config/baseEntity';

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
