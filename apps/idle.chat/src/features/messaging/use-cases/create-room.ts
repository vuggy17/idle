import { ID } from '@idle/model';
import { RoomRepositoryImpl } from '../../../services/room-service';
import { UseCase } from '../../../type';
import RoomRepository from '../repositories/room-repository';

type Input = {
  target: ID;
};
type Output = unknown;

export default class CreatePrivateRoomUseCase
  implements UseCase<Input, Output>
{
  constructor(
    private readonly _roomRepository: RoomRepository = RoomRepositoryImpl,
  ) {}

  async execute(data: Input): Promise<unknown> {
    if (!data.target) {
      throw new Error('Other user must present');
    }

    return this._roomRepository.createPrivateRoom(data.target);
  }
}
