import NxWelcome from 'app/nx-welcome';
import { useAtomValue } from 'jotai';
import { currentUser } from 'store/user';

export default function ChatIndex() {
  const userInfo = useAtomValue(currentUser);
  return (
    <div>
      <NxWelcome title={userInfo.email} />
    </div>
  );
}
