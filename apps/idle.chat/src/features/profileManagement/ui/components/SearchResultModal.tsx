import {
  Button,
  Flex,
  Image,
  Modal,
  ModalProps,
  Space,
  Typography,
} from 'antd';
import PartialAvatar from 'components/UserCard/PartialAvatar';
import { ChatBubble } from 'iconoir-react';

type SearchResult = {
  name: string;
  avatar?: string;
  bio: string;
  isFriend: boolean;
};

type SearchResultModalProps = SearchResult & {
  modalProps: ModalProps;
};

const tempProfileCover =
  'https://images.unsplash.com/photo-1541704328070-20bf4601ae3e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export default function SearchResultModal({
  ...props
}: SearchResultModalProps) {
  const { modalProps, ...user } = props;
  return (
    <Modal {...modalProps} centered width={480} closeIcon={null} footer={null}>
      <div data-testid="find-people-profile-view-popup">
        {/* profile cover */}
        <div className="h-[200px]">
          <Image
            src={user.avatar ?? tempProfileCover}
            height="100%"
            width="100%"
            className="object-cover "
          />
        </div>
        <div className="-my-10 pb-10">
          <Space
            direction="vertical"
            className="w-full justify-center relative items-center"
          >
            <PartialAvatar
              size={96}
              shape="circle"
              src={user.avatar ?? tempProfileCover}
              className="shadow-lg"
            />
            <Flex vertical className="text-center">
              <Typography.Text>{user.name}</Typography.Text>
              <Typography.Text type="secondary">{user.bio}</Typography.Text>
            </Flex>

            <div className="mt-3">
              <Button
                icon={
                  <ChatBubble
                    height={18}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      verticalAlign: '-.2em',
                    }}
                  />
                }
              >
                Send message
              </Button>
            </div>
          </Space>
        </div>
      </div>
    </Modal>
  );
}
