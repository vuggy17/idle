import { IdleContextProvider } from 'components/context';
import { SerializableThemeConfig } from 'components/context/readThemeConfig';
import getCurrentStore from 'store/atom';
import { App as AntdApp } from 'antd';
import useLocalStorageState from 'use-local-storage-state';
import AppRouter from '../router/AppRouter';

export default function App() {
  const [themeConfig, setThemeConfig] =
    useLocalStorageState<SerializableThemeConfig>('theme', {
      defaultValue: {
        algorithm: 'default',
        token: {
          colorPrimary: '#1677FF',
        },
      },
    });
  return (
    <IdleContextProvider
      store={getCurrentStore()}
      themeConfig={themeConfig}
      overrideThemeConfig={(newConfig) => {
        setThemeConfig((oldConfig) => ({ ...oldConfig, ...newConfig }));
      }}
    >
      <AntdApp className="h-full">
        <AppRouter />
      </AntdApp>
    </IdleContextProvider>
  );
}
