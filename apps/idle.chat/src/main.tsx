import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { App } from './app/app';
import './styles.css';
import { getCurrentStore } from 'store/atom';

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: any;
}) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

const AppFallback = () => (
  <div className="underline h-full w-full flex items-center justify-center">
    App Loading...
  </div>
);

async function main() {
  const { setup } = await import('./bootstrap/setup');
  const rootStore = getCurrentStore();
  await setup(rootStore);

  const root = document.getElementById('root') as HTMLElement;
  createRoot(root).render(
    <StrictMode>
      <Suspense fallback={<AppFallback key="AppLoading" />}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <App />
        </ErrorBoundary>
      </Suspense>
    </StrictMode>
  );
}

await main();
