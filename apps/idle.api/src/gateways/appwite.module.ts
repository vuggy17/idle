import { Global, Module } from '@nestjs/common';
import { AppWriteProvider } from './appwrite.provider';

@Global()
@Module({
  providers: [AppWriteProvider],
  exports: [AppWriteProvider],
})
export class AppWriteModule {}
