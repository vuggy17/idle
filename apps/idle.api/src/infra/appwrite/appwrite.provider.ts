import { Global, Injectable } from '@nestjs/common';
import appwriteSDK from 'node-appwrite';
import { IdleConfigSchema } from '../../config/type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppWriteProvider {
  protected _instance: appwriteSDK.Client;
  protected _userSDK: appwriteSDK.Users;
  protected _accountSDK: appwriteSDK.Account;
  protected _databaseSDK: appwriteSDK.Databases;

  static defaultDatabaseId = '656af2faa9d4d3352a34';
  static projectDbCollections = {
    chat: {
      friendInvitation: 'friend-invitation',
      user: 'users',
      friend: 'user-friends',
    },
  };

  constructor(protected readonly _config: ConfigService<IdleConfigSchema>) {
    this._instance = new appwriteSDK.Client();
    this._instance
      .setEndpoint(_config.get('appwrite.projectHost', { infer: true }))
      .setProject(_config.get('appwrite.projectId', { infer: true }));
  }

  setJWT(token: string) {
    if (!token) {
      throw new Error(
        'jwt token must be provided when using DisposableAppwriteClient',
      );
    }
    this._instance.setJWT(token);
    return this;
  }

  setAPIKey(apiKey: string) {
    this._instance.setKey(apiKey);
    return this;
  }

  get users() {
    if (!this._userSDK) {
      this._userSDK = new appwriteSDK.Users(this._instance);
    }
    return this._userSDK;
  }

  get account() {
    if (!this._accountSDK) {
      this._accountSDK = new appwriteSDK.Account(this._instance);
    }
    return this._accountSDK;
  }

  get database() {
    if (!this._databaseSDK) {
      this._databaseSDK = new appwriteSDK.Databases(this._instance);
    }

    return this._databaseSDK;
  }
}
