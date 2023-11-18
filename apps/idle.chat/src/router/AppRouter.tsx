import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../main';

export function wrapErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: '/welcome',
    lazy: () => import('features/welcome/pages/index'),
  },
  {
    path: '/login',
    lazy: () => import('features/auth/ui/pages/Login'),
  },
  {
    path: '/',
    element: <Navigate to="welcome" />,
  },
  {
    path: 'register',
    lazy: () => import('features/auth/ui/pages/Register'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
