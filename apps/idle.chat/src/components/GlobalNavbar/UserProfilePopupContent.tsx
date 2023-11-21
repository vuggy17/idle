import UserCard from 'components/UserCard';
import { User } from 'features/auth/entities/user';

export default function UserProfilePopupContent({ user }: { user: User }) {
  return (
    <div>
      <UserCard userName={user.email} name={user.name} />
      <div>Long long content</div>
      <div>Long long content</div>
      <div>Long long content</div>
      <div>Long long content</div>
    </div>
  );
}
