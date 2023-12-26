import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePrivateRoomRequestDTO } from '@idle/model';
import { AuthUser } from '../../config/decorators/authUser';
import { UserEntity } from '../common/user.entity';
import { Auth } from '../../config/decorators/auth';
import { RoomService } from './service';

@Auth()
@Controller('rooms')
export class RoomController {
  constructor(private readonly _roomService: RoomService) {}

  @Post()
  async createPrivateRoom(
    @AuthUser() user: UserEntity,
    @Body() body: CreatePrivateRoomRequestDTO,
  ) {
    return this._roomService.tryCreatePrivateRoom(user.id, body.with);
  }

  @Get()
  async getMyRooms(@AuthUser() user: UserEntity) {
    return this._roomService.getMyRooms(user.id);
  }
}
