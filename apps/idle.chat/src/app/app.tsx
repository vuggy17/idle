import { App as AntdApp } from 'antd';
import useLocalStorageState from 'use-local-storage-state';
import AppRouter from '../router';
import { IdleContextProvider } from '../components/context';
import { SerializableThemeConfig } from '../components/context/read-theme-config';
import getCurrentStore from '../store/atom';

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
        setThemeConfig((oldConfig: any) => ({ ...oldConfig, ...newConfig }));
      }}
    >
      <AntdApp className="h-full">
        <AppRouter />
      </AntdApp>
    </IdleContextProvider>
  );
}
