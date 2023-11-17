import { IdleContextProvider } from 'components/context';
import AppRouter from '../router/AppRouter';
import { getCurrentStore } from 'store/atom';

export default function App() {

  return (
    <IdleContextProvider store={getCurrentStore()}>
      <AppRouter />
    </IdleContextProvider>
  );
}
