import type { createStore } from 'jotai';
import { PropsWithChildren, createContext, useMemo } from 'react';
import { Provider } from 'jotai';
import { ConfigProvider } from 'antd';
import { readThemeConfig, SerializableThemeConfig } from './readThemeConfig';
import getCurrentStore from '../../store/atom';

export type IldeContextProps = {
  store: ReturnType<typeof createStore> | undefined;
  themeConfig: SerializableThemeConfig;
  overrideThemeConfig: (config: SerializableThemeConfig) => void;
};
export type IdleContextProviderProps = PropsWithChildren<IldeContextProps>;

export const IdleContext = createContext<IldeContextProps>({
  store: getCurrentStore(),
  overrideThemeConfig: () => {},
  themeConfig: {},
});

export function IdleContextProvider({
  children,
  store,
  themeConfig = {},
  overrideThemeConfig,
}: IdleContextProviderProps) {
  return (
    <Provider store={store}>
      <IdleContext.Provider
        value={useMemo(
          () => ({
            overrideThemeConfig,
            store,
            themeConfig,
          }),
          [overrideThemeConfig, store, themeConfig],
        )}
      >
        <ConfigProvider theme={readThemeConfig(themeConfig)}>
          {children}
        </ConfigProvider>
      </IdleContext.Provider>
    </Provider>
  );
}
