import { Flex, theme } from 'antd';
import { Bell, Compass, HomeSimpleDoor, MultiBubble } from 'iconoir-react';
import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { RouteKey, Routes } from '../../router/routes';

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
  console.log('nav icon ', type);
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
          <HomeSimpleDoor
            fill={isWorkspacePath(pathname) ? colorPrimary : 'none'}
            className="h-full hover:scale-110 duration-200"
          />
        );

      case 'dm':
        return (
          <NavLink to={`${matchPattern}`} className="h-full duration-200">
            {({ isActive }) => (
              <MultiBubble
                fill={isActive ? colorPrimary : 'none'}
                className="h-full hover:scale-110 "
              />
            )}
          </NavLink>
        );

      case 'activity':
        return (
          <NavLink to={`${matchPattern}`} className="h-full ">
            {({ isActive }) => (
              <Bell
                fill={isActive ? colorPrimary : 'none'}
                className="h-full hover:scale-110 "
              />
            )}
          </NavLink>
        );
      case 'discover':
        return (
          <NavLink to={`${matchPattern}`} className="h-full duration-200">
            {({ isActive }) => (
              <Compass
                fill={isActive ? colorPrimary : 'none'}
                className="h-full hover:scale-110"
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
