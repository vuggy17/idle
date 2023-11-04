import { useAtomValue } from 'jotai';
import { PropsWithChildren } from 'react';
import { currentUser } from '../store/user';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const user = useAtomValue(currentUser);
  // const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Navigate to="/register" />;
  }
  return children;
}
