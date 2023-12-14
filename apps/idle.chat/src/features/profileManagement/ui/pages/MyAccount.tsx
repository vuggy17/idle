import {
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Layout,
  List,
  Space,
  Tooltip,
  Typography,
  theme,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import PartialAvatar from '@idle/chat/components/UserCard/PartialAvatar';
import { User } from '@idle/chat/features/auth/entities/user';
import { NavArrowRight } from 'iconoir-react';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from '@idle/chat/store/user';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../components/ChangePasswordModal';
import DeactivateAccountModal from '../components/DeactivateAccountModal';

type MyAccountProps = {
  user: User;
};

const { useToken } = theme;
const { useForm } = Form;

export default function MyAccount({ user }: MyAccountProps) {
  const { email, name, avatar } = user;
  const { token } = useToken();

  const [form] = useForm();
  const navigate = useNavigate();
  const setCurrentUser = useSetAtom(currentUserAtom);

  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [delAccountModalOpen, setDelAccountModalOpen] = useState(false);

  const updateUserInfo = (info: { name?: string; avatar?: string }) => {
    if (info.name?.trim() !== '') setCurrentUser({ ...user, ...info });
  };

  const onAccountDeleted = () => {
    setDelAccountModalOpen(false);
    setTimeout(() => {
      navigate('/login');
    }, 300);
  };

  return (
    <Layout className="h-full">
      <ConfigProvider
        theme={{
          components: {
            Form: {
              verticalLabelPadding: '0 0 4px',
            },
            Divider: {
              marginLG: 0,
            },
          },
        }}
      >
        <Content className="pt-[5px]">
          <Space direction="vertical" className="w-full" size="large">
            <section>
              <Typography.Title level={4}>My profile</Typography.Title>
              <Divider className="mb-3" />
              <Form
                requiredMark={false}
                name="user-info"
                onBlur={() => updateUserInfo(form.getFieldsValue())}
                form={form}
                layout="vertical"
                initialValues={{
                  avatar: '',
                  name,
                }}
              >
                <Space size="large">
                  <Form.Item name="avatar">
                    <PartialAvatar
                      shape="square"
                      size={64}
                      alt={name}
                      src={avatar || name}
                    />
                  </Form.Item>
                  <Form.Item
                    required
                    name="name"
                    tooltip="Click away to apply change"
                    label={
                      <Typography.Text
                        type="secondary"
                        className="text-sm font-medium"
                      >
                        Preferred name
                      </Typography.Text>
                    }
                    className="w-56"
                  >
                    <Input />
                  </Form.Item>
                </Space>
              </Form>
            </section>
            <section>
              <Typography.Title level={4}>Account security</Typography.Title>
              <Divider />
              <List itemLayout="horizontal" split={false}>
                <List.Item
                  actions={[
                    <Tooltip title="Coming soon 👀">
                      <Button type="default" disabled>
                        Change email
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Typography.Text className="font-normal">
                        Email
                      </Typography.Text>
                    }
                    description={email}
                  />
                </List.Item>
                <List.Item
                  actions={[
                    <Button
                      type="default"
                      onClick={() => setPwdModalOpen(true)}
                    >
                      Change password
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Typography.Text className="font-normal">
                        Password
                      </Typography.Text>
                    }
                    description="If you lose access to your school email address, you'll be able to log in using your password."
                  />
                </List.Item>
              </List>
            </section>
            <section>
              <Typography.Title level={4}>Support</Typography.Title>
              <Divider />
              <List itemLayout="horizontal" split={false}>
                <List.Item
                  onClick={() => setDelAccountModalOpen(true)}
                  actions={[
                    <Button
                      type="text"
                      onClick={() => setDelAccountModalOpen(true)}
                      icon={
                        <NavArrowRight color={token.colorTextDescription} />
                      }
                    />,
                  ]}
                  className="cursor-pointer"
                >
                  <List.Item.Meta
                    title={
                      <Typography.Text type="danger" className="font-normal">
                        Deactivate my account
                      </Typography.Text>
                    }
                    description="Instantly close the account and remove access from idle.chat."
                  />
                </List.Item>
              </List>
            </section>
          </Space>
          <ChangePasswordModal
            destroyOnClose
            onCancel={() => setPwdModalOpen(false)}
            open={pwdModalOpen}
            onOk={() => setPwdModalOpen(false)}
          />
          <DeactivateAccountModal
            closeIcon={null}
            destroyOnClose
            onCancel={() => setDelAccountModalOpen(false)}
            open={delAccountModalOpen}
            onOk={onAccountDeleted}
          />
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
