import {
  Layout,
  ConfigProvider,
  Space,
  Typography,
  Divider,
  Form,
  List,
  Switch,
  Radio,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

const { useForm } = Form;

type NotificationPreference = {
  mode: 'receiveAll' | 'dmOnly' | 'ignoreAll';
};

const NotifyMode = {
  receiveAll: 'receiveAll',
  dmOnly: 'dmOnly',
  ignoreAll: 'ignoreAll',
};

// TODO: manage notification per conversation: muted conversation list..
type NotificationSetting = {
  dnd: boolean; // do not disturb
  shouldReceiveNotification: boolean;
  mode: NotificationPreference;
};

export default function MyNotification() {
  const [form] = useForm<NotificationSetting>();
  return (
    <Layout className="h-full">
      <ConfigProvider
        theme={{
          components: {
            Form: {
              verticalLabelPadding: '0 0 4px',
              itemMarginBottom: 0,
            },
            Divider: {
              marginLG: 0,
            },
          },
        }}
      >
        <Content className="pt-[5px] bg-white">
          <Form<NotificationSetting>
            name="user-noti"
            form={form}
            layout="vertical"
            initialValues={{
              dnd: false,
              shouldReceiveNotification: true,
              mode: NotifyMode.receiveAll,
            }}
          >
            <Space direction="vertical" className="w-full" size="large">
              <section>
                <Typography.Title level={4}>My notifications</Typography.Title>
                <Divider className="mb-3" />

                <List itemLayout="horizontal" split={false}>
                  <List.Item
                    actions={[
                      <Form.Item<NotificationSetting>
                        name="shouldReceiveNotification"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Typography.Text className="font-normal">
                          Notification
                        </Typography.Text>
                      }
                      description="You will receive notifications from your conversations"
                    />
                  </List.Item>

                  <List.Item
                    actions={[
                      <Form.Item<NotificationSetting>
                        name="dnd"
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Typography.Text className="font-normal">
                          Do not disturb
                        </Typography.Text>
                      }
                      description="Notification will be sent directly to notification center"
                    />
                  </List.Item>
                </List>
              </section>
              <section>
                <Typography.Title level={4}>Notify me about</Typography.Title>
                <Divider className="mb-3" />
                <Form.Item<NotificationSetting> name="mode">
                  <Radio.Group className="block">
                    <List itemLayout="horizontal" split={false}>
                      <List.Item
                        actions={[<Radio value={NotifyMode.receiveAll} />]}
                      >
                        <List.Item.Meta
                          title={
                            <Typography.Text className="font-normal">
                              All new messages
                            </Typography.Text>
                          }
                          description="Get notifications from all of your conversations"
                        />
                      </List.Item>
                      <List.Item
                        actions={[<Radio value={NotifyMode.dmOnly} />]}
                      >
                        <List.Item.Meta
                          title={
                            <Typography.Text className="font-normal">
                              Direct messages, mentions
                            </Typography.Text>
                          }
                          description="Notification will be sent only when there is a DM, or a @mention"
                        />
                      </List.Item>
                      <List.Item
                        actions={[<Radio value={NotifyMode.ignoreAll} />]}
                      >
                        <List.Item.Meta
                          title={
                            <Typography.Text className="font-normal">
                              Nothing
                            </Typography.Text>
                          }
                          description="You will receive no notification"
                        />
                      </List.Item>
                    </List>
                  </Radio.Group>
                </Form.Item>
              </section>
            </Space>
          </Form>
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
