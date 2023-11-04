import { atom } from 'jotai';

export const currentUser = atom(
  (get) => null,
  (_, set, user) => {
    set(currentUser, user);
    // you can set as many atoms as you want at the same time
  }
);
