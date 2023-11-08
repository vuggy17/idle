import { ConfigService } from '@nestjs/config';

export type IdleConfigSchema = {
  port: number;
  appwrite: {
    projectId: string;
    projectHost: string;
    apiKey: string;
  };
};
export type IdleConfigService = ConfigService<IdleConfigSchema>;
