import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';

const providers: Provider[] = [];
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
