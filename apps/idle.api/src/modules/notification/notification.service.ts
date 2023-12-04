import { Injectable } from '@nestjs/common';
import { Notification, NotificationService } from './type';
import { ID } from '@idle/model';

@Injectable()
export class RealTimeNotificationService implements NotificationService {
  private notifications: Notification[] = [];

  async sendFriendRequestNotification(
    senderId: ID,
    receiverId: ID,
  ): Promise<void> {
    const notification: Notification = {
      id: Math.random().toString(36).substring(7),
      type: 'FriendRequest',
      message: `${senderId} sent you a friend request.`,
      sentBy: senderId,
      sentTo: receiverId,
      timestamp: new Date(),
    };
    this.notifications.push(notification);
    await this.sendRealTimeNotification(notification);
    return;
  }
  sendNewMessageNotification(
    senderId: ID,
    receiverId: ID,
    message: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendMentionNotification(
    userId: ID,
    mentionedBy: string,
    context: string,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getNotifications(userId: string): Promise<Notification[]> {
    // This mock implementation returns all notifications, but in a real implementation,
    // you would filter the notifications based on the userId.
    throw new Error('Method not implemented.');
  }

  private async sendRealTimeNotification(
    notification: Notification,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

// import WebSocket from 'ws';

// class RealTimeNotificationService implements NotificationService {
//   private notifications: Notification[] = [];
//   private clients: WebSocket[] = [];

//   constructor() {
//     const wss = new WebSocket.Server({ port: 8080 });

//     wss.on('connection', ws => {
//       this.clients.push(ws);

//       ws.on('close', () => {
//         this.clients = this.clients.filter(client => client !== ws);
//       });
//     });
//   }

//   async sendFriendRequestNotification(senderId: string, receiverId: string): Promise<void> {
//     const notification: Notification = {
//       id: Math.random().toString(36).substring(7),
//       type: 'FriendRequest',
//       message: `${senderId} sent you a friend request.`,
//       timestamp: new Date(),
//     };
//     this.notifications.push(notification);
//     this.sendRealTimeNotification(notification);
//   }

//   async sendNewMessageNotification(senderId: string, receiverId: string, message: string): Promise<void> {
//     const notification: Notification = {
//       id: Math.random().toString(36).substring(7),
//       type: 'NewMessage',
//       message: `New message from ${senderId}: ${message}`,
//       timestamp: new Date(),
//     };
//     this.notifications.push(notification);
//     this.sendRealTimeNotification(notification);
//   }

//   async sendMentionNotification(userId: string, mentionedBy: string, context: string): Promise<void> {
//     const notification: Notification = {
//       id: Math.random().toString(36).substring(7),
//       type: 'Mention',
//       message: `You were mentioned by ${mentionedBy}: ${context}`,
//       timestamp: new Date(),
//     };
//     this.notifications.push(notification);
//     this.sendRealTimeNotification(notification);
//   }

//   async getNotifications(userId: string): Promise<Notification[]> {
//     // This mock implementation returns all notifications, but in a real implementation,
//     // you would filter the notifications based on the userId.
//     return this.notifications;
//   }

//   private sendRealTimeNotification(notification: Notification): void {
//     this.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify(notification));
//       }
//     });
//   }
// }
