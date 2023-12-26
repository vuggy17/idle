import { Flex, Modal, ModalProps } from 'antd';
import { useState } from 'react';
import { User } from '@idle/chat/features/auth/entities/user';
import PartialAvatar from '../../../../../components/UserCard/PartialAvatar';
import PeoplePicker from './PeoplePicker';
import CreatePrivateRoomUseCase from '../../../useCases/createRoom';

const users = [
  {
    id: '65783f2667e49368e9f6',
    name: 'user test',
    avatar: '',
    bio: 'wait for implement',
  },
  {
    id: '6576ccb7bb65f5a59d6d',
    name: 'user appwrite dev',
    avatar: '',
    bio: 'wait for implement',
  },
  {
    id: '6571a60c4515d969f4b2',
    name: 'tett user',
    avatar: '',
    bio: 'wait for implement',
  },
  {
    id: '655a1bd717a1156feb03',
    name: 'user duy vu dang khuong ',
    avatar: '',
    bio: 'wait for implement',
  },
];

const options = users.map((u) => ({
  value: u.id,
  label: u.name,
  other: u,
}));

type TagRenderProps = {
  label: React.ReactNode;
  value: any;
  disabled: boolean;
  onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  closable: boolean;
};

const tagRender = (props: TagRenderProps) => {
  const { value, closable, onClose } = props;
  const { avatar, name, email } = value as User;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Flex>
      <PartialAvatar src={avatar || name} />
    </Flex>
  );
};

export default function NewChatModal({ ...props }: ModalProps) {
  const { onOk, ...selectProps } = props;
  const [selectedUser, setSelectedUser] = useState<User[]>([]);

  const createOrNavigateChat = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (selectedUser.length > 1) {
      // create group room
      return;
    }

    const executor = new CreatePrivateRoomUseCase();
    executor.execute({
      target: selectedUser[0].id,
    });
    onOk?.(e);
  };

  return (
    <Modal
      {...selectProps}
      onOk={createOrNavigateChat}
      okButtonProps={{
        ...selectProps.okButtonProps,
        disabled: selectedUser.length === 0,
      }}
    >
      <div className="h-40">
        <PeoplePicker
          onChange={(_, options) => {
            setSelectedUser((options as any[]).map((op) => op.other));
          }}
        />
      </div>
    </Modal>
  );
}
