import { ID, TIME } from '@idle/model';

export type FriendRequest = {
  id: ID;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  sentBy: ID;
  sentTo: ID;
  createdAt: TIME;
  updatedAt: TIME;
};
