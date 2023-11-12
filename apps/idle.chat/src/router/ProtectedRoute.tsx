import { useAtomValue } from 'jotai';
import { PropsWithChildren, useEffect } from 'react';
import { currentUserAtom } from '../store/user';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const user = useAtomValue(currentUserAtom);
  // guest
  if (!user.$id) {
    // user is not authenticated
    return <Navigate to="/login" />;
  } else {
    return children;
  }
}
