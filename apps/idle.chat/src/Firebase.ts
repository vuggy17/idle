import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getMessaging, Messaging, getToken } from 'firebase/messaging';

const config = {};

//https://stackoverflow.com/questions/63937976/how-to-get-fcm-token
//https://stackoverflow.com/questions/75432399/messaging-failed-service-worker-registration
//https://firebase.google.com/docs/cloud-messaging/js/client#generate_a_new_key_pair
export class Firebase {
  constructor() {
    if (getApps().length) return;
    const app = initializeApp(config);
    // navigator.serviceWorker.getRegistrations().then((registrations) => {
    //   if (registrations.length) {
    //     [this.registration] = registrations;
    //     return;
    //   }
    //   navigator.serviceWorker
    //     .register('/firebase-message-sw.js')
    //     .then((registration) => {
    //       this.registration = registration;
    //     });
    // });
  }

  private get messaging(): Messaging {
    return getMessaging(getApp());
  }

  async askNotificationPermission() {
    try {
      // const token = await this.messaging.getToken({
      //   serviceWorkerRegistration: this.registration,
      // });
      const token = await getToken(this.messaging, {
        vapidKey: 'OmibYwWW1UIqdMqqoxRaMgxYulyzV5orRegaWo7My2g',
      });

      console.log(token);
      return token;
    } catch (error) {
      console.error('[FIREBASE ERROR]: ', error);
      return null;
    }
  }

  async requestPermission(): Promise<boolean> {
    return new Promise((resolve) => {
      console.log('Requesting permission...');
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          return resolve(true);
        } else return resolve(false);
      });
    });
  }
}
