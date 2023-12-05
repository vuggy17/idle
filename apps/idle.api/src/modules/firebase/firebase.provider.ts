import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdleConfigSchema } from '../../config/type';
import * as admin from 'firebase-admin';
import 'firebase/firestore';

@Injectable()
export class FirebaseProvider {
  app: admin.app.App;

  constructor(private readonly configService: ConfigService<IdleConfigSchema>) {
    const firebaseConfig = {
      type: this.configService.get('firebase.type', { infer: true }),
      project_id: this.configService.get('firebase.projectId', { infer: true }),
      private_key_id: this.configService.get('firebase.privateKeyId', {
        infer: true,
      }),
      private_key: Buffer.from(
        this.configService.get<string>('firebase.privateKey', {
          infer: true,
        }),
        'base64',
      ).toString('ascii'),
      client_email: this.configService.get('firebase.clientEmail', {
        infer: true,
      }),
      client_id: this.configService.get('firebase.clientId', { infer: true }),
      auth_uri: this.configService.get('firebase.authUri', { infer: true }),
      token_uri: this.configService.get('firebase.tokenUri', { infer: true }),
      auth_provider_x509_cert_url: this.configService.get(
        'firebase.authProviderX509CertUrl',
        { infer: true },
      ),
      client_x509_cert_url: this.configService.get(
        'firebase.clientX509CertUrl',
        {
          infer: true,
        },
      ),
      universe_domain: this.configService.get('firebase.universeDomain', {
        infer: true,
      }),
    } as admin.ServiceAccount;

    this.app = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  get db() {
    return this.app.firestore();
  }
}
