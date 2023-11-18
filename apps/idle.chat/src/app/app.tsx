import { IdleContextProvider } from 'components/context';
import getCurrentStore from 'store/atom';
import AppRouter from '../router/AppRouter';

export default function App() {
  return (
    <IdleContextProvider store={getCurrentStore()}>
      <AppRouter />
    </IdleContextProvider>
  );
}
