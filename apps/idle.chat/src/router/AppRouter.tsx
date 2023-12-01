import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { AppRoutes, AppSubPages } from './routes';

const router = createBrowserRouter([
  {
    lazy: () => import('@idle/chat/app/AppLayoutWithGnb'),
    children: [
      {
        path: AppRoutes.home.key,
        lazy: () => import('@idle/chat/features/chat/pages/index'),
      },
      {
        path: AppRoutes.dm.key,
        element: 'dm',
      },
      {
        path: AppRoutes.activity.key,
        element: 'activity',
      },
      {
        path: AppRoutes.discover.key,
        lazy: () =>
          import(
            '@idle/chat/features/profileManagement/ui/pages/DiscoverLayout'
          ),
        children: [
          {
            index: true,
            lazy: () =>
              import(
                '@idle/chat/features/profileManagement/ui/components/FindPeople'
              ),
          },
          {
            path: AppSubPages.discover_request,
            lazy: () =>
              import(
                '@idle/chat/features/profileManagement/ui/components/FriendInvitation'
              ).then((res) => ({
                Component: res.Component,
                loader: res.Loader,
              })),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('@idle/chat/features/auth/ui/pages/Login'),
  },
  {
    path: '/',
    element: <Navigate to={`${AppRoutes.home.key}`} />,
  },
  {
    path: 'register',
    lazy: () => import('@idle/chat/features/auth/ui/pages/Register'),
  },
  {
    path: '*',
    lazy: () => import('./NoMatch'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
