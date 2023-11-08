// const routes =

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Register from '../features/auth/ui/pages/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { ReactNode } from 'react';
import { ErrorFallback } from '../main';
import { ErrorBoundary } from 'react-error-boundary';
import Welcome from 'features/welcome/pages';
import Login from 'features/auth/ui/pages/Login';

function wrapErrorBoundary(component: ReactNode) {
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
    element: wrapErrorBoundary(<Login />),
  },
  {
    path: '/',
    element: wrapErrorBoundary(<Navigate to={'chat'} />),
  },
  {
    path: 'register',
    element: wrapErrorBoundary(<Register />),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
