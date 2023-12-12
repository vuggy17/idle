import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../user';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
