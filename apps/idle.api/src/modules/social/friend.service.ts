import { Injectable } from '@nestjs/common';
import { ID } from '@idle/model';

@Injectable()
export class FriendService {
  constructor() {}

  async createFriendRequest(sender: ID, receiver: ID) {}
}
