import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../services/use-auth';

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  // guest
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
}
