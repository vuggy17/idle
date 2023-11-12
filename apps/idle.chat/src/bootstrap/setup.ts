import { Account } from 'appwrite';
import { createStore } from 'jotai';
import { AppWriteProvider } from 'providers/appwrite';
import { AuthService } from 'services/authService';
import { currentUserAtom } from 'store/user';

export async function setup(store: ReturnType<typeof createStore>) {
  const authProvider = new AuthService(new Account(AppWriteProvider));
  const currentLoggedInUser = await authProvider.getCurrentUser();
  store.set(currentUserAtom, currentLoggedInUser);
}
