import { RoomRepositoryImpl } from '@idle/chat/services/roomService';
import { ID } from '@idle/model';
import { UseCase } from '../../../type';
import RoomRepository from '../repositories/roomRepository';

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
