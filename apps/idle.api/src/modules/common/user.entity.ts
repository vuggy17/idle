import { Exclude } from 'class-transformer';
import { Models } from 'node-appwrite';
import { AppwriteEntity } from '../../config/baseEntity';

export class UserEntity extends AppwriteEntity {
  name: string;

  email: string;

  avatar: string;

  phone: string;

  @Exclude()
  meta: string;

  @Exclude()
  friends: any;

  // work around until appwrite allow to create multiple 1way relation
  // https://github.com/appwrite/appwrite/issues/6281
  @Exclude()
  'friendInvitations-receiver': any;

  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}

/**
 * Appwrite user data stored in appwrite
 * @INTERNAL DO NOT RETURN TO CLIENT
 */
export type AppWriteUserEntity = Models.User<Models.Preferences>;
