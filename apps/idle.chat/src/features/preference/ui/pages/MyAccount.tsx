import {
  Avatar,
  Button,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Layout,
  List,
  Space,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { User } from 'features/auth/entities/user';

type MyAccountProps = {
  user: {
    $id: string;
    email: string;
    name: string;
    phone: string;
  };
};

export default function MyAccount({ user }: MyAccountProps) {
  const [form] = Form.useForm();
  const { email, name } = user;
  const avatar = undefined; // TODO add avatar

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
        <Content>
          <Space direction="vertical" className="w-full" size="large">
            <section>
              <Typography.Title level={4}>My profile</Typography.Title>
              <Divider className='mb-3'/>
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  avatar: '',
                  name,
                }}
              >
                <Space size="large">
                  <Form.Item name="avatar">
                    {avatar ? (
                      <Avatar
                        shape="square"
                        alt={name}
                        size="large"
                        src={avatar}
                      />
                    ) : (
                      <Avatar
                        shape="square"
                        size={64}
                        alt={name}
                        style={{ backgroundColor: '#f56a00' }}
                      >
                        {
                          // generate user name, ex: appwrite dev => AD
                          name
                            .split(' ')
                            .map((shortName) => shortName.charAt(0))
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                        }
                      </Avatar>
                    )}
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
                  actions={[<Button type="default">Change email</Button>]}
                >
                  <List.Item.Meta
                    title={<Typography.Text>Email</Typography.Text>}
                    description={email}
                  />
                </List.Item>
                <List.Item
                  actions={[<Button type="default">Change password</Button>]}
                >
                  <List.Item.Meta
                    title={<Typography.Text>Password</Typography.Text>}
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
                  actions={[<Button type="text" icon={'>'} />]}
                  className="cursor-pointer"
                >
                  <List.Item.Meta
                    title={
                      <Typography.Text type="danger">
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
        </Content>
      </ConfigProvider>
    </Layout>
  );

  return null;
}
