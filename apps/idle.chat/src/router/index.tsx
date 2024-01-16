import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { Routes } from './routes';

const router = createBrowserRouter([
  {
    path: Routes.workspace,
    lazy: () => import('../pages/index'),

    children: [
      {
        path: ':workspaceId',
        lazy: () => import('../pages/workspace'),
        children: [
          {
            index: true,
            lazy: () => import('../features/messaging/pages/no-room'),
            handle: {
              crumb: 'workspace',
            },
          },
          {
            path: ':roomId',
            lazy: () => import('../features/messaging/pages/room-detail'),
            handle: {
              crumb: 'workspace',
            },
          },
          {
            path: Routes.dm,
            element: 'dm',
            handle: {
              crumb: Routes.dm,
            },
          },
          {
            path: Routes.activity,
            lazy: () =>
              import('../features/notifications/ui/notification-center'),
            handle: {
              crumb: Routes.activity,
            },
          },
          {
            path: Routes.discover,
            lazy: () =>
              import('../features/profile-management/pages/discover-layout'),
            handle: {
              crumb: Routes.discover,
            },
            children: [
              {
                index: true,
                lazy: () =>
                  import(
                    '../features/profile-management/components/find-people'
                  ),
              },
              {
                path: 'friend_requests',
                lazy: () =>
                  import(
                    '../features/profile-management/components/friend-invitation'
                  ).then((res) => ({
                    Component: res.Component,
                    loader: res.Loader,
                  })),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    lazy: () => import('../features/auth/pages/login'),
  },
  {
    path: '/',
    element: <Navigate to={`${Routes.workspace}`} />,
  },
  {
    path: 'register',
    lazy: () => import('../features/auth/pages/register'),
  },
  {
    path: '*',
    lazy: () => import('./no-match'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
