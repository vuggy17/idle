import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';

// eslint-disable-next-line import/prefer-default-export
export function wrapErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  );
}
