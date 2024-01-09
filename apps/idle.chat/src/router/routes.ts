export type RouteKey = 'workspace' | 'dm' | 'activity' | 'discover';
export type SubRouteKey = '.' | 'friend_requests';

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
  workspace: {
    key: 'workspace',
    name: 'Workspace',
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

export const Routes = {
  workspace: 'workspace',
  dm: 'dm',
  activity: 'activity',
  discover: 'discover',
} as const;

export const AppPages: Record<RouteKey, RouteKey> = {
  workspace: 'workspace',
  dm: 'dm',
  activity: 'activity',
  discover: 'discover',
} as const;

/**
 *  `.` means it's a index route of parent route,
 *
 * @example ```people``` is index route of `discover` route in {@linkcode AppSubPages.discover_people}
 */
export const AppSubPages = {
  discover_people: '.',
  discover_request: 'friend_requests',
} as const;
