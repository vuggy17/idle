import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  MessagePayload,
  getMessaging,
  getToken,
  onMessage,
} from 'firebase/messaging';

const config = {
  apiKey: 'AIzaSyDRx3ePwCOMuWeVGeY9PbtRr8pbL1E1l14',
  authDomain: 'idle-1f400.firebaseapp.com',
  projectId: 'idle-1f400',
  storageBucket: 'idle-1f400.appspot.com',
  messagingSenderId: '221108427627',
  appId: '1:221108427627:web:b78ea8ec4fe9a347a34a2e',
  measurementId: 'G-RS9WTK4CRE',
};

// https://stackoverflow.com/questions/63937976/how-to-get-fcm-token
// https://stackoverflow.com/questions/75432399/messaging-failed-service-worker-registration
// https://firebase.google.com/docs/cloud-messaging/js/client#generate_a_new_key_pair
export class Firebase {
  readonly app: FirebaseApp;

  constructor() {
    if (getApps().length) {
      this.app = getApps().at(0)!;
    }
    this.app = initializeApp(config);
    // getAnalytics(this.app);
  }

  get messaging() {
    return getMessaging(this.app);
  }

  /**
   * The `onReceiveMessage` function sets up a callback to be executed when a message is received.
   * @param cb - A callback function that takes a payload of type MessagePayload as its parameter.
   * @returns A callback to stop listen to stop listening for messages.
   */
  onReceiveMessage(cb: (payload: MessagePayload) => void) {
    return onMessage(this.messaging, (payload) => {
      cb(payload);
    });
  }

  start() {
    return this;
  }

  async getFCMToken() {
    try {
      const { app } = this;
      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey:
          'BL1qwacwhyOJKaPlhJ5uWHs519lhrR_O9fS2eL311sMLvYgE9pbBcuJbSgnNpHNTid10_WWN-7MQU693UqJhtl0',
      });
      return token;
    } catch (error) {
      console.error('[FIREBASE ERROR]: ', error);
      return null;
    }
  }

  static async askNotificationPermission(): Promise<boolean> {
    const notificationPermission = await Notification.requestPermission();
    return notificationPermission === 'granted';
  }
}

export const FireBaseInstance = new Firebase();
