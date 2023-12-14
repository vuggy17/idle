import { UserDTO } from './authDto';
import { ID } from './common';

export interface RoomDTO {
  id: ID;
  members: UserDTO[];
  type: 'group' | 'private';
}

export type CreatePrivateRoomRequestDTO = {
  with: ID;
};
export type CreateRoomResponseDTO = RoomDTO;

export type GetRoomResponseDTO = RoomDTO[];
