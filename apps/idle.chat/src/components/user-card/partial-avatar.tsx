import { Avatar, AvatarProps } from 'antd';
import stc from 'string-to-color';

function isValidHttpUrl(maybeUrl: string) {
  let url: URL;

  try {
    url = new URL(maybeUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const DEFAULT_SHAPE = 'square';
type PartialAvatarProps = Omit<AvatarProps, 'src'> & { src: string };

/**
 * Auto fallback to letter avatar if src is not a valid url
 */
export default function PartialAvatar({ ...props }: PartialAvatarProps) {
  const { alt, src: imgSrcOrUserName, shape, ...avatarProps } = props;

  return isValidHttpUrl(imgSrcOrUserName) ? (
    <Avatar
      alt={props.alt ?? imgSrcOrUserName}
      src={imgSrcOrUserName}
      shape={shape ?? DEFAULT_SHAPE}
      {...avatarProps}
    />
  ) : (
    <Avatar
      alt={props.alt ?? imgSrcOrUserName}
      shape={shape ?? DEFAULT_SHAPE}
      {...avatarProps}
      style={{ backgroundColor: stc(imgSrcOrUserName) }}
    >
      {
        // generate user name, ex: appwrite dev => AD
        imgSrcOrUserName
          .split(' ')
          .map((shortName) => shortName.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
    </Avatar>
  );
}
