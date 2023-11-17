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
import PartialAvatar from 'components/PartialAvatar';
import { User } from 'features/auth/entities/user';
import { NavArrowRight } from 'iconoir-react';
import { useSetAtom } from 'jotai';
import { currentUserAtom } from 'store/user';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import DeleteAccountModal from '../components/DeleteAccountModal';
type MyAccountProps = {
  user: User;
};

const { useToken } = theme;
const { useForm } = Form;

export default function MyAccount({ user }: MyAccountProps) {
  const [form] = useForm();
  const { token } = useToken();
  const [changePasswordModalOpened, setChangePasswordModalOpened] =
    useState(false);
  const [deleteAccountModalOpened, setDeleteAccountModalOpened] =
    useState(false);
  const { email, name, avatar } = user;
  const setCurrentUser = useSetAtom(currentUserAtom);

  const updateUserInfo = (info: { name?: string; avatar?: string }) => {
    setCurrentUser({ ...user, ...info });
  };

  return (
    <Layout className="h-full bg-white">
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
                      src={avatar}
                    />
                  </Form.Item>
                  <Form.Item
                    name="name"
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
                      onClick={() => setChangePasswordModalOpened(true)}
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
                  onClick={() => setDeleteAccountModalOpened(true)}
                  actions={[
                    <Button
                      type="text"
                      onClick={() => setDeleteAccountModalOpened(true)}
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
                        Delete my account
                      </Typography.Text>
                    }
                    description={
                      'Permanently delete the account and remove access from all workspaces.'
                    }
                  />
                </List.Item>
              </List>
            </section>
          </Space>
          <ChangePasswordModal
            destroyOnClose={true}
            onCancel={() => setChangePasswordModalOpened(false)}
            open={changePasswordModalOpened}
            onOk={() => setChangePasswordModalOpened(false)}
          />
          <DeleteAccountModal
            closeIcon={null}
            destroyOnClose={true}
            onCancel={() => setDeleteAccountModalOpened(false)}
            open={deleteAccountModalOpened}
            onOk={() => setDeleteAccountModalOpened(false)}
          />
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
