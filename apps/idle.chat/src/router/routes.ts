export type RouteKey = 'home' | 'dm' | 'activity' | 'discover';

/**
 * @property key: route pathname
 * @property name: route name
 * @property children: sub routes
 */
type Route = {
  key: RouteKey;
  name: string;
  children?: Route[];
};

export const AppRoutes: Record<RouteKey, Route> = {
  home: {
    key: 'home',
    name: 'Home',
  },
  dm: {
    key: 'dm',
    name: 'DMs',
  },
  activity: {
    key: 'activity',
    name: 'Activity',
  },
  discover: {
    key: 'discover',
    name: 'Discover',
  },
} as const;

export const AppPages: Record<RouteKey, RouteKey> = {
  home: 'home',
  dm: 'dm',
  activity: 'activity',
  discover: 'discover',
} as const;
