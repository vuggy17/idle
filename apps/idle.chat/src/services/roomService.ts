import { ID, RoomDTO } from '@idle/model';
import RoomRepository from '../features/messaging/repositories/roomRepository';
import HttpProvider, { HttpClient } from '../providers/http';

export default class RoomService implements RoomRepository {
  constructor(private httpGateway: HttpClient) {}

  async createPrivateRoom(userId: ID): Promise<RoomDTO> {
    return this.httpGateway.createRoom({
      with: userId,
    });
  }
}

export const RoomRepositoryImpl = new RoomService(HttpProvider);
