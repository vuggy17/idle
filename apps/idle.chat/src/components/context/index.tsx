import type { createStore } from 'jotai';
import { PropsWithChildren } from 'react';
import { Provider } from 'jotai';

export type IldeContextProps = PropsWithChildren<{
  store?: ReturnType<typeof createStore>;
}>;

// global context
// TODO: theme context,..
export function IdleContextProvider({ children, ...props }: IldeContextProps) {
  return <Provider store={props.store}>{children}</Provider>;
}
