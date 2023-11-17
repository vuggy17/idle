import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth();
  console.log("route rendering")
  // guest
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}