// const routes =

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { ReactNode } from 'react';
import { ErrorFallback } from '../main';
import { ErrorBoundary } from 'react-error-boundary';
import Welcome from 'features/welcome/pages';

export function wrapErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: '/welcome',
    element: wrapErrorBoundary(
      <ProtectedRoute>
        <Welcome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    lazy: () => import('features/auth/ui/pages/Login'),
  },
  {
    path: '/',
    element: <Navigate to={'welcome'} />,
  },
  {
    path: 'register',
    lazy: () => import('features/auth/ui/pages/Register'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
