import { Card, Space, Typography } from 'antd';

export default function UnderConstruction() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Card>
        <Space direction="vertical">
          <h2>Sorry this page is not ready yet!</h2>
          <div>
            {' '}
            <Typography.Text>
              Please come back later <span role="img">🐺😿🐺</span>
            </Typography.Text>
          </div>
        </Space>
      </Card>
    </div>
  );
}
