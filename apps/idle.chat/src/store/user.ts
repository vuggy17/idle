import { UserDTO } from '@idle/model';
import { atom } from 'jotai';

type User = UserDTO;

const guest: User = {
  id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
  avatar: '',
  createdAt: -1,
  updatedAt: -1,
};

const userAtom = atom<User>(guest);

// eslint-disable-next-line import/prefer-default-export
export const currentUserAtom = atom(
  (get) => get(userAtom),
  (get, set, user: User) => {
    set(userAtom, user);
    // you can set as many atoms as you want at the same time
  },
);
