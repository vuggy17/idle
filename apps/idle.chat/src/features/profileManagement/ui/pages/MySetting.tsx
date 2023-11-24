import { Layout, ConfigProvider, Space, Typography, Divider } from 'antd';
import { Content } from 'antd/es/layout/layout';
import UnderConstruction from 'components/UnderConstruction';

export default function MySetting() {
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
        <Content className="pt-[5px]">
          <Space direction="vertical" className="w-full" size="large">
            <section>
              <Typography.Title level={4}>Appearance</Typography.Title>
              <Divider className="mb-3" />
              <UnderConstruction />
            </section>
          </Space>
        </Content>
      </ConfigProvider>
    </Layout>
  );
}
