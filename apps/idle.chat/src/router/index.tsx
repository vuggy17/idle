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
            lazy: () => import('../features/messaging/pages'),
          },

          {
            path: ':roomId',
            element: 'roomid',
          },
          {
            path: Routes.dm,
            element: 'dm',
          },
          {
            path: Routes.activity,
            lazy: () =>
              import('../features/notifications/ui/NotificationCenter'),
          },
          {
            path: Routes.discover,
            lazy: () =>
              import('../features/profileManagement/pages/DiscoverLayout'),
            children: [
              {
                index: true,
                lazy: () =>
                  import(
                    '../features/profileManagement/components/FindPeople'
                  ),
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
