import { ID } from '@idle/model';

export default interface RoomRepository {
  createPrivateRoom(user: ID): Promise<unknown>;
}
