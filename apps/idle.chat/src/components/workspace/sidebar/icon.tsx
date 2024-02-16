import { Flex, theme } from 'antd';
import { Bell, Compass, HomeSimpleDoor, MultiBubble } from 'iconoir-react';
import { useMemo } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { RouteKey, Routes } from '../../../router/routes';

const { useToken } = theme;

/**
 * Icon for app routes, including: `dm`, `home`, `activity`
 *
 *
 * @see {@linkcode RouteKey}
 */
export default function SideBarIcon({
  type,
  matchPattern,
}: {
  type: RouteKey;
  matchPattern: string;
}) {
  const {
    token: { colorPrimary },
  } = useToken();

  const { pathname } = useLocation();

  const isWorkspacePath = (currentPathName: string) => {
    if (
      currentPathName.includes(Routes.dm) ||
      currentPathName.includes(Routes.activity) ||
      currentPathName.includes(Routes.discover)
    )
      return false;

    return true;
  };

  // eslint-disable-next-line consistent-return
  const icon = useMemo(() => {
    switch (type) {
      case 'workspace':
        return (
          <Link to="." relative="route" className="h-full ">
            <HomeSimpleDoor
              fill={isWorkspacePath(pathname) ? colorPrimary : 'none'}
              className="h-full"
            />
          </Link>
        );

      case 'dm':
        return (
          <NavLink to={`${matchPattern}`} className="h-full " relative="route">
            {({ isActive }) => (
              <MultiBubble
                fill={isActive ? colorPrimary : 'none'}
                className="h-full"
              />
            )}
          </NavLink>
        );

      case 'activity':
        return (
          <NavLink to={`${matchPattern}`} className="h-full" relative="route">
            {({ isActive }) => (
              <Bell
                fill={isActive ? colorPrimary : 'none'}
                className="h-full"
              />
            )}
          </NavLink>
        );
      case 'discover':
        return (
          <NavLink to={`${matchPattern}`} className="h-full " relative="route">
            {({ isActive }) => (
              <Compass
                fill={isActive ? colorPrimary : 'none'}
                className="h-full"
              />
            )}
          </NavLink>
        );
    }
  }, [type, matchPattern, pathname, colorPrimary]);
  return (
    <Flex className="h-full w-full" justify="center" align="center">
      {icon}
    </Flex>
  );
}
