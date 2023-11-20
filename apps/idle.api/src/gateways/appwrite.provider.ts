import { Injectable } from '@nestjs/common';
import appwriteSDK from 'node-appwrite';
import { IdleConfigSchema, IdleConfigService } from 'config/type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppWriteProvider {
  private _instance: appwriteSDK.Client;
  private _userSDK: appwriteSDK.Users;

  constructor(private _config: ConfigService<IdleConfigSchema>) {
    this._instance = new appwriteSDK.Client();
    this._instance
      .setEndpoint(this._config.get('appwrite.projectHost', { infer: true }))
      .setProject(this._config.get('appwrite.projectId', { infer: true }))
      .setKey(this._config.get('appwrite.apiKey', { infer: true }));
  }

  get users() {
    if (!this._userSDK) {
      this._userSDK = new appwriteSDK.Users(this._instance);
    }
    return this._userSDK;
  }
}
