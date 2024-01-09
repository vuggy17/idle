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
        path: `:workspaceId`,
        lazy: () => import('../pages/workspace'),
        children: [
          {
            index: true,
            lazy: () => import('../features/messaging/pages/NoRoom'),
            handle: {
              crumb: 'workspace',
            },
          },
          {
            path: ':roomId',
            lazy: () => import('../features/messaging/pages/RoomDetail'),
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
              import('../features/notifications/ui/NotificationCenter'),
            handle: {
              crumb: Routes.activity,
            },
          },
          {
            path: Routes.discover,
            lazy: () =>
              import('../features/profileManagement/pages/DiscoverLayout'),
            handle: {
              crumb: Routes.discover,
            },
            children: [
              {
                index: true,
                lazy: () =>
                  import('../features/profileManagement/components/FindPeople'),
              },
              {
                path: 'friend_requests',
                lazy: () =>
                  import(
                    '../features/profileManagement/components/FriendInvitation'
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
    lazy: () => import('../features/auth/pages/Login'),
  },
  {
    path: '/',
    element: <Navigate to={`${Routes.workspace}`} />,
  },
  {
    path: 'register',
    lazy: () => import('../features/auth/pages/Register'),
  },
  {
    path: '*',
    lazy: () => import('./NoMatch'),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
