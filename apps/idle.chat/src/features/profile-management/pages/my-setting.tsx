import { Layout, ConfigProvider, Space, Typography, Divider } from 'antd';

import UnderConstruction from '../../../components/under-construction';

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
        <Layout.Content className="pt-[5px]">
          <Space direction="vertical" className="w-full" size="large">
            <section>
              <Typography.Title level={4}>Appearance</Typography.Title>
              <Divider className="mb-3" />
              <UnderConstruction />
            </section>
          </Space>
        </Layout.Content>
      </ConfigProvider>
    </Layout>
  );
}
