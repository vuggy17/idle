import { atom } from 'jotai';

type User = {
  $id: string;
  email: string;
  name: string;
  phone: string;
};

const guest: User = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
};

const userAtom = atom<User>(guest);

export const currentUserAtom = atom(
  (get) => get(userAtom),
  (get, set, user: User) => {
    set(userAtom, user);
    // you can set as many atoms as you want at the same time
  }
);
