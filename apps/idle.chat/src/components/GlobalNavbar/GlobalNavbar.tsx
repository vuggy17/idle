import { ConfigProvider, Flex, Popover, Tooltip } from 'antd';
import PartialAvatar from 'components/UserCard/PartialAvatar';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from 'store/user';
import UserProfilePopupContent from './UserProfilePopupContent';

export default function GlobalNavbar() {
  const currentUser = useAtomValue(currentUserAtom);
  return (
    <ConfigProvider
      theme={{
        components: {
          Popover: {
            zIndexPopup: 1080, // make user name tooltip won't overlay popover
          },
        },
      }}
    >
      <Flex className="h-full bg-lime-200" vertical justify="space-between">
        <div>things</div>
        <Tooltip title={currentUser.name}>
          <Popover
            content={<UserProfilePopupContent user={currentUser} />}
            trigger="click"
            placement="rightTop"
          >
            <PartialAvatar
              shape="square"
              size={48}
              className="mx-auto mb-6 hover:cursor-pointer"
            />
          </Popover>
        </Tooltip>
      </Flex>
    </ConfigProvider>
  );
}
