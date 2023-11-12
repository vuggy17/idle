// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IdleContextProvider } from 'components/context';
import AppRouter from '../router/AppRouter';
import { getCurrentStore } from 'store/atom';

export function App() {

  return (
    <IdleContextProvider store={getCurrentStore()}>
      <AppRouter />
    </IdleContextProvider>
  );
}
