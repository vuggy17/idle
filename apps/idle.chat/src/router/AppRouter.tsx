import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../main';
import { AppRoutes } from './routes';
import NoMatch from './NoMatch';

export function wrapErrorBoundary(component: ReactNode) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{component}</ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    lazy: () => import('app/AppLayoutWithGnb'),
    children: [
      {
        path: AppRoutes.home.key,
        lazy: () => import('features/chat/pages/index'),
      },
      {
        path: AppRoutes.dm.key,
        element: 'dm',
      },
      {
        path: AppRoutes.activity.key,
        element: 'activity',
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('features/auth/ui/pages/Login'),
  },
  {
    path: '/',
    element: <Navigate to={`${AppRoutes.home.key}`} />,
  },
  {
    path: 'register',
    lazy: () => import('features/auth/ui/pages/Register'),
  },
  {
    path: '*',
    element: <NoMatch />,
    lazy: () => import('./NoMatch'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
