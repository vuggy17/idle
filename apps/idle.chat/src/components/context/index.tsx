import type { createStore } from 'jotai';
import { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { ConfigProvider } from 'antd';

export type IldeContextProps = PropsWithChildren<{
  store?: ReturnType<typeof createStore>;
}>;

// global context
// TODO: theme context,..
export function IdleContextProvider({ children, ...props }: IldeContextProps) {
  return (
    <Provider store={props.store}>
      <ConfigProvider
        theme={{
          token: {
            // fontFamily: 'Inter, sans-serif',
          },
        }}
      >
        {children}
      </ConfigProvider>
    </Provider>
  );
}
