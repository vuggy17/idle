import { UserDTO } from '@idle/model';

export default interface RoomRepository {
  createRoom(users: UserDTO): Promise<unknown>;
  doesRoomExisted(members: UserDTO[]): Promise<boolean>;
}
