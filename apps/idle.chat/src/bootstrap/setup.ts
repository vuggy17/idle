import { Account } from 'appwrite';
import { createStore } from 'jotai';
import { AppWriteProvider } from 'providers/appwrite';
import { AuthService } from 'services/authService';
import { currentUserAtom } from 'store/user';
const guest = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
};
export async function setup(store: ReturnType<typeof createStore>) {
  try {
    const authProvider = new AuthService(new Account(AppWriteProvider));
    const currentLoggedInUser = await authProvider.getCurrentUser();
    console.log(
      '🚀 ~ file: setup.ts:10 ~ setup ~ currentLoggedInUser:',
      currentLoggedInUser
    );
    store.set(currentUserAtom, currentLoggedInUser);
  } catch (error) {
    store.set(currentUserAtom, guest);
  }
}
