import { Module, Provider } from '@nestjs/common';
import { RoomController } from './controller';
import { RoomService } from './service';
import { RoomRepository, RoomRepositoryImpl } from './repository';

const providers: Provider[] = [
  RoomService,
  {
    provide: RoomRepository,
    useClass: RoomRepositoryImpl,
  },
];

@Module({
  controllers: [RoomController],
  providers: [...providers],
})
export class RoomModule {}
