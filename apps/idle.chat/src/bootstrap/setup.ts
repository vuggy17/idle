import { createStore } from 'jotai';
import { AuthServiceImpl } from '@idle/chat/features/auth/repositories/authRepository';
import { currentUserAtom } from '@idle/chat/store/user';

export default async function setup(store: ReturnType<typeof createStore>) {
  const authProvider = AuthServiceImpl;
  try {
    const currentLoggedInUser = await authProvider.getCurrentUser();
    store.set(currentUserAtom, currentLoggedInUser);
  } catch (error) {} // prevent crash when a new user is opening the app
}
