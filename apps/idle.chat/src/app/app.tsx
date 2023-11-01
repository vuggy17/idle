// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConfigProvider } from '@idle/environments';
import styles from './app.module.css';

import NxWelcome from './nx-welcome';
console.log('app config', process.env.APP_PROJECT_ID)
export function App() {
  return (
    <div>
      <NxWelcome title="idle.mhr" />
    </div>
  );
}

export default App;
