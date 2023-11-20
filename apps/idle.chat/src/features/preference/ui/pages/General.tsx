import {
  Card,
  Col,
  ConfigProvider,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  Radio,
  Row,
  Space,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import ThemeCard from '../components/ThemeCard';

const { useForm } = Form;
export default function General() {
  const [form] = useForm();
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
        <Content className="pt-[5px] overflow-auto  basis-0">
          <section className="h-full ">
            <Typography.Title level={4}>General</Typography.Title>
            <Divider className="mb-3" />
            <div className="grid-cols-2 grid gap-2">
              <div id="col1">
                <div className="h-72 mb-2">
                  <Card
                    className="h-full"
                    bodyStyle={{
                      height: '100%',
                    }}
                    title="Notification settings"
                  >
                    <div className="bg-slate-700 h-full"> home1</div>
                  </Card>
                </div>

                <div className="h-80">
                  <Card
                    className="h-full"
                    bodyStyle={{
                      height: '100%',
                    }}
                  >
                    <div className="bg-slate-700 h-full"> home1.1</div>
                  </Card>
                </div>
              </div>

              <div id="col2">
                <div className="h-80 mb-2">
                  <Card
                    className="h-full"
                    bodyStyle={{
                      height: '100%',
                    }}
                  >
                    <div className="bg-slate-700 h-full"> home2</div>
                  </Card>
                </div>
                <div className="h-80">
                  <Card
                    className="h-full"
                    bodyStyle={{
                      height: '100%',
                    }}
                    title="Personalize ilde"
                  >
                    <div className="h-full">
                      <Form
                        form={form}
                        initialValues={{
                          theme: 1,
                        }}
                        onChange={() => console.log(form.getFieldsValue())}
                      >
                        <Form.Item noStyle name="theme">
                          <Flex wrap="wrap" gap={6}>
                            <label
                              htmlFor="theme1"
                              className="relative inline-block"
                              // onClick={() => form.setFieldValue('theme', 1)}
                            >
                              <ThemeCard value="1" name="default" />
                              <input
                                id="theme1"
                                name="theme"
                                type="radio"
                                value="1"
                                className="w-0 h-0 opacity-0 absolute"
                              />
                            </label>
                            <label
                              htmlFor="theme2"
                              className="relative inline-block"
                              // onClick={() => form.setFieldValue('theme', 2)}
                            >
                              <ThemeCard value="2" name="default" />
                              <input
                                id="theme2"
                                name="theme"
                                value="2"
                                type="radio"
                                className="w-0 h-0 opacity-0 absolute"
                              />
                            </label>
                          </Flex>
                        </Form.Item>
                      </Form>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
