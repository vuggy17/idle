// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');

// const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 **/
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js',
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyAVGQCE016rDKuyfZS7OQrL5gFm2o_zu4c',
  authDomain: 'idle-notification.firebaseapp.com',
  projectId: 'idle-notification',
  storageBucket: 'idle-notification.appspot.com',
  messagingSenderId: '608944995064',
  appId: '1:608944995064:web:6fa6b31347d7b91f62590d',
  measurementId: 'G-BLFV1V1EXD',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

async function getFCMToken() {
  try {
    const token = await messaging.getToken({
      serviceWorkerRegistration: self.registration,
    });
    return token;
  } catch (error) {
    console.error('[FIREBASE ERROR]: ', error);
    return null;
  }
}
getFCMToken();
