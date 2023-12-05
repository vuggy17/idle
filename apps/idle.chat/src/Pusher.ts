import * as PusherPushNotifications from '@pusher/push-notifications-web';

export class Pusher {
  instance: PusherPushNotifications.Client;

  constructor() {
    this.instance = new PusherPushNotifications.Client({
      instanceId: 'f27f24ea-35aa-4def-98c3-2caf167b77da',
    });
  }

  /**
   * The `onReceiveMessage` function sets up a callback to be executed when a message is received.
   * @param cb - A callback function that takes a payload of type MessagePayload as its parameter.
   * @returns A callback to stop listen to stop listening for messages.
   */
  onReceiveMessage(cb: (payload: any) => void) {
    // return onMessage(this.messaging, (payload) => {
    //   cb(payload);
    // });
  }
}

export const PusherClient = new Pusher();
