import { Module, Provider } from '@nestjs/common';
import { UserController } from './user.controller';
import UserService from './user.service';
import { UserRepository, UserRepositoryImpl } from './repository';

const providers: Provider[] = [
  {
    provide: UserRepository,
    useClass: UserRepositoryImpl,
  },
  UserService,
];

@Module({
  imports: [],
  controllers: [UserController],
  providers,
})
export class UserModule {}
