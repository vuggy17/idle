import { Exclude } from 'class-transformer';
import {
  CockroachEntity,
  INTERNAL_ATTRIBUTE_DO_NOT_RETURN,
} from '../../config/baseEntity';

export class UserEntity extends CockroachEntity {
  name: string;

  email: string;

  avatar: string;

  phone: string;

  @Exclude()
  meta: INTERNAL_ATTRIBUTE_DO_NOT_RETURN<string>;

  @Exclude()
  appwriteId: INTERNAL_ATTRIBUTE_DO_NOT_RETURN<string>;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
