import { Global, Module } from '@nestjs/common';
import {
  PersistentAppWriteProvider,
  persistentAppwriteClientProvider,
} from './appwrite.persistent.provider';
import {
  DisposableAppWriteClient,
  disposableAppwriteClientProvider,
} from './appwrite.onetime.provider';

import { AppWriteProvider } from './appwrite.provider';

@Global()
@Module({
  providers: [
    disposableAppwriteClientProvider,
    persistentAppwriteClientProvider,
    AppWriteProvider,
  ],
  exports: [PersistentAppWriteProvider, DisposableAppWriteClient],
})
export default class AppWriteModule {}
