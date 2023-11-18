import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  // guest
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
