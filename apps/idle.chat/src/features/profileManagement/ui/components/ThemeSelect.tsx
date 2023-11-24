import { Card, ConfigProvider, Layout, Radio, theme } from 'antd';
import './styles.css';
import { ReactNode } from 'react';
import { SerializableThemeConfig, readThemeConfig } from 'components/context';

const wrapThemeConfig = (
  preset: SerializableThemeConfig,
  Component: ReactNode,
) => (
  <ConfigProvider theme={readThemeConfig(preset)}>{Component}</ConfigProvider>
);

const { useToken } = theme;
function ThemeCard() {
  const { token } = useToken();
  return (
    <Layout
      className="rounded-sm hover:shadow-xl  hover:scale-105 duration-75"
      style={{
        width: 120,
        height: 90,
      }}
    >
      <Card
        style={{
          width: 42,
          height: 42,
        }}
        className="rounded-md absolute bottom-1 right-1"
      >
        <div
          className="w-4/5 h-2 rounded-md mx-auto absolute bottom-1 inset-x-0"
          style={{
            backgroundColor: token.colorPrimary,
          }}
        />
      </Card>
    </Layout>
  );
}

type ThemeSelectProps = {
  value: SerializableThemeConfig;
  // eslint-disable-next-line react/require-default-props
  onChange?: (value: SerializableThemeConfig) => void;
};

export default function ThemeSelect({ value, onChange }: ThemeSelectProps) {
  const triggerChange = (selectedTheme: SerializableThemeConfig) => {
    onChange?.(selectedTheme);
  };

  return (
    <span className="theme-card contents">
      <ConfigProvider
        theme={{
          components: {
            Radio: {
              wrapperMarginInlineEnd: 0,
            },
          },
        }}
      >
        <Radio value={value} onChange={() => triggerChange(value)}>
          {wrapThemeConfig(value, <ThemeCard />)}
        </Radio>
      </ConfigProvider>
    </span>
  );
}
