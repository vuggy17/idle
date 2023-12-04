import { ID } from '@idle/model';

export interface Notification {
  id: string;
  type: 'FriendRequest' | 'NewMessage' | 'Mention';
  message: string;
  timestamp: Date;
  sentBy: ID;
  sentTo: ID;
}

export interface NotificationService {
  sendFriendRequestNotification(
    senderId: string,
    receiverId: string,
  ): Promise<void>;
  sendNewMessageNotification(
    senderId: string,
    receiverId: string,
    message: string,
  ): Promise<void>;
  sendMentionNotification(
    userId: string,
    mentionedBy: string,
    context: string,
  ): Promise<void>;
  getNotifications(userId: string): Promise<Notification[]>;
}
