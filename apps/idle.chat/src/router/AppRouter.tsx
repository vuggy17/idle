// const routes =

import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import Register from '../modules/auth/pages/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { ReactNode } from 'react';
import { ErrorFallback } from '../main';
import { ErrorBoundary } from 'react-error-boundary';
import ChatIndex from 'modules/chat/pages';

function wrapErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: '/chat',
    element: wrapErrorBoundary(
      <ProtectedRoute>
        <ChatIndex />
      </ProtectedRoute>
    ),
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
