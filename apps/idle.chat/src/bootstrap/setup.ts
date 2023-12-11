import { createStore } from 'jotai';
import { AuthServiceImpl } from '@idle/chat/services/authService';
import { currentUserAtom } from '@idle/chat/store/user';

const guest = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
};
export default async function setup(store: ReturnType<typeof createStore>) {
  try {
    const authProvider = AuthServiceImpl;
    const currentLoggedInUser = await authProvider.getCurrentUser();
    store.set(currentUserAtom, currentLoggedInUser);
  } catch (error) {
    store.set(currentUserAtom, guest);
  }
}
