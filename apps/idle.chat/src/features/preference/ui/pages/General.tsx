import {
  Card,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Layout,
  List,
  Radio,
  Switch,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { SerializableThemeConfig, useIdleContext } from 'components/context';
import ThemeSelect from '../components/ThemeSelect';
import { PreferenceSubPages, SubPages } from './availablePages';

const { useForm } = Form;

const preMadeThemes: SerializableThemeConfig[] = [
  {
    algorithm: 'default',
    token: {
      colorPrimary: '#1677FF',
    },
  },
  {
    algorithm: 'default',
    token: {
      colorPrimary: '#5A54F9',
    },
  },
  {
    algorithm: 'dark',
    token: {
      colorPrimary: '#9E339F',
    },
  },
  {
    algorithm: 'dark',
    token: {
      colorPrimary: '#84cc16',
    },
  },
  {
    algorithm: 'default',
    token: {
      colorPrimary: '#E0282E',
    },
  },
  {
    algorithm: 'dark',
    token: {
      colorPrimary: '#F4801A',
    },
  },
];

type QuickSettingForm = {
  preset: SerializableThemeConfig;
  notification: {
    dnd: boolean;
  };
};

type GeneralProps = {
  navigateToPage: (page: SubPages) => void;
};

export default function General({ navigateToPage }: GeneralProps) {
  const [form] = useForm<QuickSettingForm>();
  const { overrideThemeConfig } = useIdleContext();
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
        <Content className="pt-[5px] overflow-y-auto basis-0">
          <Form<QuickSettingForm>
            preserve={false}
            form={form}
            initialValues={{
              theme: 'default',
            }}
            onChange={() => {
              if (form.getFieldValue('preset')) {
                overrideThemeConfig(form.getFieldValue('preset'));
              }
            }}
          >
            <section>
              <Typography.Title level={4}>General</Typography.Title>
              <Divider className="mb-3" />
              <div className="grid-cols-2 grid gap-2">
                <div id="col1">
                  <Card className="mb-2">
                    <Card.Meta title="Notification settings" />
                    <div className="mt-4">
                      <List itemLayout="horizontal" split={false}>
                        <List.Item
                          actions={[
                            <Form.Item name="dnd" valuePropName="checked">
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
                    </div>
                  </Card>
                </div>

                <div id="col2">
                  <Card>
                    <Card.Meta
                      title="Personalize ilde"
                      description={
                        <>
                          <Typography.Text type="secondary">
                            Chose our pre-made preset to customize your ilde
                            appearance or
                          </Typography.Text>
                          <Typography.Link
                            onClick={() =>
                              navigateToPage(PreferenceSubPages.MySetting)
                            }
                          >
                            &nbsp; customize your own
                          </Typography.Link>
                        </>
                      }
                    />
                    <div className="h-full pt-4">
                      <Form.Item<QuickSettingForm> name="preset">
                        <Radio.Group>
                          <Flex wrap="wrap" gap={4}>
                            {preMadeThemes.map((preset) => (
                              <ThemeSelect
                                value={preset}
                                key={`${preset.algorithm}_${preset.token?.colorPrimary}`}
                              />
                            ))}
                          </Flex>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </Card>
                </div>
              </div>
            </section>
          </Form>
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
