import { ID } from '@idle/model';
import { Injectable } from '@nestjs/common';
import { RoomRepository } from './repository';

@Injectable()
export class RoomService {
  constructor(private readonly _roomRepository: RoomRepository) {}

  async createPrivateRoom(creator: ID, target: ID) {
    return this._roomRepository.createPrivateRoom(creator, target);
  }

  async getMyRooms(myId: ID) {
    return this._roomRepository.getMyRooms(myId);
  }
}
