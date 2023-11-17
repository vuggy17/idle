import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { ReactNode } from 'react';
import { ErrorFallback } from '../main';
import { ErrorBoundary } from 'react-error-boundary';
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
    path: '/setting',
    lazy: () => import('features/preference/ui/pages/Preference'),
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
