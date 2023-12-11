import { ConfigService } from '@nestjs/config';
import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { IdleConfigSchema } from '../../config/type';
import { AppWriteProvider } from './appwrite.provider';
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
