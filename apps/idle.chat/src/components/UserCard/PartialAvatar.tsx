import { Avatar, AvatarProps } from 'antd';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '@idle/chat/store/user';
import stc from 'string-to-color';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type PartialAvatarProps = PartialBy<AvatarProps, 'src'>;

/**
 * Auto fallback to avatar with letters from `current username` if no `src` is provided
 */
export default function PartialAvatar({ ...props }: PartialAvatarProps) {
  const { alt, src, ...avatarProps } = props;
  const user = useAtomValue(currentUserAtom);
  // const user = {};
  const userName = user.name ?? 'Guest';

  return src ? (
    <Avatar alt={props.alt ?? userName} src={src} {...avatarProps} />
  ) : (
    <Avatar
      alt={props.alt ?? userName}
      {...avatarProps}
      style={{ backgroundColor: stc(userName) }}
    >
      {
        // generate user name, ex: appwrite dev => AD
        userName
          .split(' ')
          .map((shortName) => shortName.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
    </Avatar>
  );
}
