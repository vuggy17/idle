import { Account } from 'appwrite';
import { useAtom } from 'jotai';
import { AppWriteProvider } from 'providers/appwrite';
import { useCallback, useEffect, useState } from 'react';
import { AuthService } from 'services/authService';
import { currentUserAtom } from 'store/user';

const guest = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
};

const authRepo = new AuthService(new Account(AppWriteProvider));

export function useAuth() {
  const [currentUser, setUser] = useAtom(currentUserAtom);
  const [isAuthenticated, setIsAuthenticated] = useState(
    currentUser.$id ? true : false
  );

  useEffect(() => {
    setIsAuthenticated(currentUser.$id ? true : false);
  }, [currentUser]);

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
      [setUser]
    ),
  };
}
