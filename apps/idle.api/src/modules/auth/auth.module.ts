import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';
import { AuthRepository } from './auth.repository';

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthRepository],
  exports: [AuthRepository],
})
export class AuthModule {}
