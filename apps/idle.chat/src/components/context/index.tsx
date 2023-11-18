import type { createStore } from 'jotai';
import { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { ConfigProvider, App } from 'antd';

export type IldeContextProps = PropsWithChildren<{
  store: ReturnType<typeof createStore> | undefined;
}>;

// global context
// TODO: theme context,..
export function IdleContextProvider({ children, store }: IldeContextProps) {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            // fontFamily: 'Inter, sans-serif',
          },
        }}
      >
        <App className="h-full">{children}</App>
      </ConfigProvider>
    </Provider>
  );
}
