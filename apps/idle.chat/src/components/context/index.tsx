import type { createStore } from 'jotai';
import { PropsWithChildren, createContext, useContext, useMemo } from 'react';
import { Provider } from 'jotai';
import { ConfigProvider, ThemeConfig, theme } from 'antd';
import getCurrentStore from 'store/atom';
import { Modify } from 'utils/typing';

export type SerializableThemeConfig = Modify<
  ThemeConfig,
  {
    algorithm?: 'dark' | 'default' | 'compact';
  }
>;

export type IldeContextProps = {
  store: ReturnType<typeof createStore> | undefined;
  themeConfig: SerializableThemeConfig;
  overrideThemeConfig: (config: SerializableThemeConfig) => void;
};
export type IdleContextProviderProps = PropsWithChildren<IldeContextProps>;

const IdleContext = createContext<IldeContextProps>({
  store: getCurrentStore(),
  overrideThemeConfig: () => {},
  themeConfig: {},
});

export function readThemeConfig(config: SerializableThemeConfig): ThemeConfig {
  const algorithmMapping = {
    default: theme.defaultAlgorithm,
    dark: theme.darkAlgorithm,
    compact: theme.compactAlgorithm,
  };

  const algorithm = algorithmMapping[config.algorithm ?? 'default'];

  return {
    ...config,
    algorithm,
  };
}

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

/**
 * follow https://ant.design/docs/react/customize-theme
 *
 * see {@linkcode ThemeConfig}
 */
export const useIdleContext = () => useContext(IdleContext);
