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
type PartialAvatarProps = Omit<AvatarProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
};

/**
 * Auto fallback to letter avatar if src is not a valid url
 *  @param alt: alt for image, should be username to fallback when we cannot load img url
 *  @param src: image url
 */
export default function PartialAvatar({ ...props }: PartialAvatarProps) {
  const { alt: altOrUserName, src, shape, ...avatarProps } = props;

  return isValidHttpUrl(src) ? (
    <Avatar
      alt={props.alt}
      src={src}
      shape={shape ?? DEFAULT_SHAPE}
      {...avatarProps}
    />
  ) : (
    <Avatar
      alt={props.alt}
      shape={shape ?? DEFAULT_SHAPE}
      {...avatarProps}
      style={{ backgroundColor: stc(altOrUserName) }}
    >
      {
        // generate user name, ex: appwrite dev => AD
        altOrUserName
          .split(' ')
          .map((shortName) => shortName.charAt(0))
          .join('')
          .toUpperCase()
          .slice(0, 2)
      }
    </Avatar>
  );
}
