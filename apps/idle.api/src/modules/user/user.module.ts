import { Module, Provider } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository, UserRepositoryImpl } from './repository';
import { FriendModule } from '../friend/module';

const providers: Provider[] = [
  {
    provide: UserRepository,
    useClass: UserRepositoryImpl,
  },
  UserService,
];

@Module({
  imports: [FriendModule],
  controllers: [UserController],
  providers: [...providers],
  exports: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
