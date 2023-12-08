import { Exclude } from 'class-transformer';
import { AppwriteEntity } from '../../config/baseEntity';

export class UserEntity extends AppwriteEntity {
  name: string;
  email: string;
  avatar: string;
  phone: string;

  @Exclude()
  meta: string;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
