import { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import getCurrentStore from './store/atom';
import './styles.css';
import ErrorFallback from './ErrorFallback';

function AppFallback() {
  return (
    <div className="underline h-full w-full flex items-center justify-center">
      App Loading...
    </div>
  );
}

const App = lazy(() => import('./app/app'));
const root = document.getElementById('idle-root') as HTMLElement;

async function main() {
  const setup = (await import('./bootstrap/setup')).default;
  const rootStore = getCurrentStore();
  await setup(rootStore);
  createRoot(root).render(
    <Suspense fallback={<AppFallback key="AppLoading" />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </Suspense>,
  );
}

await main();
