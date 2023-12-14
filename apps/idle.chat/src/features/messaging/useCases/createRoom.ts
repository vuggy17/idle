import { RoomRepositoryImpl } from '@idle/chat/services/roomService';
import { UseCase } from '../../../type';
import { User } from '../../auth/entities/user';
import RoomRepository from '../repositories/roomRepository';

type Input = {
  users: User[];
  self: User;
};
type Output = unknown;

export default class CreateRoomUseCase implements UseCase<Input, Output> {
  constructor(
    private readonly _roomRepository: RoomRepository = RoomRepositoryImpl,
  ) {}

  async execute(data: Input): Promise<unknown> {
    try {
      // check if room is existed
      const isExisted = await this._roomRepository.doesRoomExisted(data.users);

      if (isExisted) return {} as unknown;

      const target = data.users.find((u) => u.id !== data.self.id);
      if (!target) {
        throw new Error('Other user must present');
      }

      return this._roomRepository.createRoom(target);
    } catch (error) {}
  }
}
