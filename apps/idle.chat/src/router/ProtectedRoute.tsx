import { useAtomValue } from 'jotai';
import { PropsWithChildren } from 'react';
import { currentUser } from '../store/user';
import { Navigate } from 'react-router-dom';
import { AuthService } from 'services/authService';
import { Account } from 'appwrite';
import { AppWriteProvider } from 'providers/appwrite';

export function ProtectedRoute({ children }: PropsWithChildren) {
  const user = useAtomValue(currentUser);

  // guest
  if (!user.$id) {
    // user is not authenticated
    return <Navigate to="/login" />;
  } else {
    const loggedInUser = new AuthService(new Account(AppWriteProvider))
      .getCurrentLoggedInUser()
      .then((user) => console.log(user));


    return children;
  }
}
