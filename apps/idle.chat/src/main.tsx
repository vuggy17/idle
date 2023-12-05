import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import getCurrentStore from './store/atom';
import './styles.css';
import { FireBaseInstance, Firebase } from './Firebase';
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

async function main() {

  const setup = (await import('./bootstrap/setup')).default;
  const rootStore = getCurrentStore();
  await setup(rootStore);
  const root = document.getElementById('root') as HTMLElement;
  createRoot(root).render(
    <Suspense fallback={<AppFallback key="AppLoading" />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </Suspense>,
  );
}

await main();
