import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import getCurrentStore from './store/atom';
import './styles.css';
import { Firebase } from './Firebase';
// import * as PusherPushNotifications from '@pusher/push-notifications-web';

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: unknown;
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

function AppFallback() {
  return (
    <div className="underline h-full w-full flex items-center justify-center">
      App Loading...
    </div>
  );
}

const App = lazy(() => import('./app/app'));

export const askForNotification = async () => {
  const tempMessaging = await messaging();

  if (tempMessaging) {
    const newSw = await navigator.serviceWorker.register(
      '/homepage/basename/firebase-messaging-sw.js',
    );

    return getNotificationPermission(
      async () =>
        await getToken(tempMessaging, {
          vapidKey,
          serviceWorkerRegistration: newSw,
        }),
    );
  }
};

async function main() {
  // const beamsClient = new PusherPushNotifications.Client({
  // });

  // beamsClient.start()
  //   .then(() => beamsClient.addDeviceInterest('hello'))
  //   .then(() => console.log('Successfully registered and subscribed!'))
  //   .catch(console.error);

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => console.log(registrations));

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const firebaseApp = new Firebase();
  const setup = (await import('./bootstrap/setup')).default;
  const rootStore = getCurrentStore();
  await setup(rootStore);
  const root = document.getElementById('root') as HTMLElement;
  createRoot(root).render(
    <Suspense fallback={<AppFallback key="AppLoading" />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <button
          role="button"
          onClick={async () => {
            const per = await firebaseApp.requestPermission();
            if (per) {
              firebaseApp.askNotificationPermission();
            }
          }}
        >
          click
        </button>
        <App />
      </ErrorBoundary>
    </Suspense>,
  );
}

await main();
