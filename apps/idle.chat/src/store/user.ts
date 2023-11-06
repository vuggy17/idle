import { atom } from 'jotai';

const userAtom = atom<any>(null);

export const currentUser = atom(
  (get) => get(userAtom),
  (get, set, user) => {
    set(userAtom, user);
    // you can set as many atoms as you want at the same time
  }
);
