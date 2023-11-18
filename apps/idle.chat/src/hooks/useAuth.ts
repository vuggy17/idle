import { Account } from 'appwrite';
import { useAtom } from 'jotai';
import { AppWriteProvider } from 'providers/appwrite';
import { useCallback, useMemo } from 'react';
import AuthService from 'services/authService';
import { currentUserAtom } from 'store/user';

const guest = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
  avatar: '',
};

const authRepo = new AuthService(new Account(AppWriteProvider));

export default function useAuth() {
  const [currentUser, setUser] = useAtom(currentUserAtom);
  const isAuthenticated = useMemo(() => !!currentUser.$id, [currentUser.$id]);
  // const isAuthenticated = true;
  // const setUser = (use: any) => {
  //   return use;
  // };

  return {
    isAuthenticated,
    logout: useCallback(async () => {
      await authRepo.logout();
      setUser(guest);
    }, [setUser]),
    login: useCallback(
      async (email: string, password: string) => {
        await authRepo.login(email, password);
        const user = await authRepo.getCurrentUser();
        setUser(user);
      },
      [setUser],
    ),
  };
}
