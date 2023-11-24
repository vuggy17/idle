import { Flex, theme } from 'antd';
import { Bell, Compass, HomeSimpleDoor, MultiBubble } from 'iconoir-react';
import { useMemo } from 'react';
import { RouteKey } from 'router/routes';

const { useToken } = theme;

/**
 * Icon for app routes, including: `dm`, `home`, `activity`
 *
 *
 * @see {@linkcode RouteKey}
 */
export default function NavIcon({
  type,
  solid,
}: {
  type: RouteKey;
  solid?: boolean;
}) {
  const {
    token: { colorPrimary },
  } = useToken();

  // eslint-disable-next-line consistent-return
  const icon = useMemo(() => {
    switch (type) {
      case 'home':
        return (
          <HomeSimpleDoor
            fill={solid ? colorPrimary : 'none'}
            className="h-full hover:scale-110 duration-200"
          />
        );

      case 'dm':
        return (
          <MultiBubble
            fill={solid ? colorPrimary : 'none'}
            className="h-full hover:scale-110 duration-200"
          />
        );

      case 'activity':
        return (
          <Bell
            fill={solid ? colorPrimary : 'none'}
            className="h-full hover:scale-110 duration-200"
          />
        );
      case 'discover':
        return (
          <Compass
            fill={solid ? colorPrimary : 'none'}
            className="h-full hover:scale-110 duration-200"
          />
        );
    }
  }, [type, solid, colorPrimary]);

  return (
    <Flex className="h-full w-full" justify="center" align="center">
      {icon}
    </Flex>
  );
}
