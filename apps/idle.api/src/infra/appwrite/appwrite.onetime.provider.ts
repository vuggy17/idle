import { ConfigService } from '@nestjs/config';
import { IdleConfigSchema } from '../../config/type';
import { FactoryProvider, Scope } from '@nestjs/common';
import { AppWriteProvider } from './appwrite.provider';
import { REQUEST } from '@nestjs/core';
import { ContextPayload } from '../../config/ContextIdStrategy';

export const DisposableAppWriteClient = 'DisposableAppWriteClient';

export const disposableAppwriteClientProvider: FactoryProvider<AppWriteProvider> =
  {
    provide: DisposableAppWriteClient,
    scope: Scope.REQUEST,
    durable: true,
    useFactory: (
      ctxPayload: ContextPayload, // {jwt: string} provided by contextIdStrategy
      configService: ConfigService<IdleConfigSchema>,
    ) => {
      return new AppWriteProvider(configService).setJWT(ctxPayload.jwt);
    },
    inject: [REQUEST, ConfigService],
  };
