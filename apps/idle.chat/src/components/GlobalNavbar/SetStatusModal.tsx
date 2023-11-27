import {
  Modal,
  Space,
  Input,
  Button,
  Typography,
  ModalProps,
  List,
  ConfigProvider,
} from 'antd';
import { EmojiSatisfied } from 'iconoir-react';
import { useState, MouseEvent } from 'react';

const recentStatus = [
  'Chasing dreams and making memories.🌟📸',
  'Homework today, or Netflix? 📚🆚🎬',
  'Just aced the test! 🎉 #FeelingProud',
  'Weekend vibes with the squad! 🎉👯‍♀️ #Besties',
];
export default function SetsStatusModal({ ...modalProps }: ModalProps) {
  const [statusText, setStatusText] = useState('');

  const closeModal = () => {
    modalProps?.onCancel?.({} as MouseEvent<HTMLButtonElement>);
  };

  const updateStatusText = (text: string) => {
    setStatusText(text);
  };

  const saveUserStatus = (status: string) => {
    // call api
    // then
    closeModal();
  };

  return (
    <Modal
      {...modalProps}
      destroyOnClose
      centered
      footer={[
        <Button onClick={() => closeModal()}>Cancel</Button>,
        <Button
          type="primary"
          disabled={!statusText}
          onClick={(e) => saveUserStatus(statusText)}
        >
          Save
        </Button>,
      ]}
      width={480}
      title="Set a status"
    >
      <Space direction="vertical" className="w-full pt-4" size="large">
        <Input
          type="textarea"
          value={statusText}
          onChange={(e) => updateStatusText(e.target.value)}
          autoFocus
          size="large"
          placeholder="What's your feeling?"
          prefix={<Button type="link" icon={<EmojiSatisfied />} />}
        />
        <div>
          <Typography.Text strong>Recent</Typography.Text>

          <ConfigProvider
            theme={{
              components: {
                List: {
                  itemPaddingSM: '0',
                },
                Button: {
                  paddingInline: 16,
                },
              },
            }}
          >
            <List
              size="small"
              split={false}
              dataSource={recentStatus}
              renderItem={(status) => (
                <List.Item key={status}>
                  <Button
                    type="text"
                    className="w-full text-left"
                    onClick={() => updateStatusText(status)}
                  >
                    {status}
                  </Button>
                </List.Item>
              )}
            />
          </ConfigProvider>
        </div>
      </Space>
    </Modal>
  );
}
