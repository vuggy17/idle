import { RoomDTO, UserDTO } from '@idle/model';
import RoomRepository from '../features/messaging/repositories/roomRepository';
import HttpProvider, { HttpClient } from '../providers/http';

export default class RoomService implements RoomRepository {
  constructor(private httpGateway: HttpClient) {}

  async createRoom(user: UserDTO): Promise<RoomDTO> {
    return this.httpGateway.createRoom({
      with: user.id,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async doesRoomExisted(members: UserDTO[]) {
    return false;
  }
}

export const RoomRepositoryImpl = new RoomService(HttpProvider);
