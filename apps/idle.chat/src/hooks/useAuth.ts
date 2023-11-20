import LoginUseCase from 'features/auth/useCases/login';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { AuthServiceImpl } from 'services/authService';
import { currentUserAtom } from 'store/user';

const guest = {
  $id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
  avatar: '',
};

export default function useAuth() {
  const [currentUser, setUser] = useAtom(currentUserAtom);
  const isAuthenticated = useMemo(() => !!currentUser.$id, [currentUser.$id]);

  return {
    isAuthenticated,
    logout: useCallback(async () => {
      await AuthServiceImpl.logout();
      setUser(guest);
    }, [setUser]),
    login: useCallback(
      async (email: string, password: string) => {
        const loginUseCase = new LoginUseCase();
        await loginUseCase.execute({ email, password });
        const user = await AuthServiceImpl.getCurrentUser();
        setUser(user);
      },
      [setUser],
    ),
  };
}
