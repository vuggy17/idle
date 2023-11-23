import { ValueOf } from 'utils/typing';

export const PreferenceSubPages = {
  General: '1',
  MyAccount: '2',
  MySetting: '3',
  MyNotification: '4',
} as const;
export type SubPages = ValueOf<typeof PreferenceSubPages>;
