import { ConfigService } from '@nestjs/config';

export type IdleConfigSchema = {
  port: number;
  appwrite: {
    projectId: string;
    projectHost: string;
    apiKey: string;
  };
  firebase: {
    type: string;
    projectId: string;
    privateKeyId: string;
    privateKey: string;
    clientEmail: string;
    clientId: string;
    authUri: string;
    tokenUri: string;
    authProviderX509CertUrl: string;
    clientX509CertUrl: string;
    universeDomain: string;
  };
};
export type IdleConfigService = ConfigService<IdleConfigSchema>;
