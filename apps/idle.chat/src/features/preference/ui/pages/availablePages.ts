export const PreferenceSubPages = {
  General: '1',
  MyAccount: '2',
  MySetting: '3',
  MyNotification: '4',
} as const;
type ValueOf<T> = T[keyof T];
export type SubPages = ValueOf<typeof PreferenceSubPages>;
