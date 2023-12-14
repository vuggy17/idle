import LoginUseCase from '@idle/chat/features/auth/useCases/login';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { currentUserAtom } from '@idle/chat/store/user';
import { UserDTO } from '@idle/model';
import { AuthServiceImpl } from '../features/auth/repositories/authRepository';

const guest: UserDTO = {
  id: '',
  email: 'guest',
  name: 'guest',
  phone: 'guest',
  avatar: '',
  createdAt: -1,
  updatedAt: -1,
};

export default function useAuth() {
  const [currentUser, setUser] = useAtom(currentUserAtom);
  const isAuthenticated = useMemo(() => !!currentUser.id, [currentUser.id]);

  const login = useCallback(
    async (email: string, password: string) => {
      const loginUseCase = new LoginUseCase();
      const session = await loginUseCase.execute({ email, password });
      localStorage.setItem('user_id', session.userId);

      const jwt = await AuthServiceImpl.createAuthToken();
      localStorage.setItem('jwt', JSON.stringify(jwt));

      const user = await AuthServiceImpl.getCurrentUser();
      setUser(user);
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    await AuthServiceImpl.logout();
    localStorage.clear();

    setUser(guest);
  }, [setUser]);

  return {
    isAuthenticated,
    logout,
    login,
  };
}
