import { ID } from '@idle/model';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoomRepository } from './repository';

@Injectable()
export class RoomService {
  constructor(private readonly _roomRepository: RoomRepository) {}

  async tryCreatePrivateRoom(creator: ID, target: ID) {
    try {
      const room = await this._roomRepository.findPrivateRoom({
        memberIds: [creator, target],
      });

      return room;
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
      return this._roomRepository.createPrivateRoom(creator, target);
    }
  }

  async getMyRooms(myId: ID) {
    return this._roomRepository.getMyRooms(myId);
  }
}
