import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IdleConfigSchema } from '../../config/type';
import { AppWriteProvider } from './appwrite.provider';

export const PersistentAppWriteProvider = 'PersistentAppWriteProvider';

export const persistentAppwriteClientProvider: FactoryProvider<AppWriteProvider> =
  {
    provide: PersistentAppWriteProvider,
    useFactory: (configService: ConfigService<IdleConfigSchema>) => {
      return new AppWriteProvider(configService).setAPIKey(
        configService.get('appwrite.apiKey', { infer: true }),
      );
    },
    inject: [ConfigService],
  };
