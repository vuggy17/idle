import { useEffect } from 'react';
import { FireBaseInstance } from '../../../firebase';

export function Component() {
  useEffect(() => {
    const unsubscribe = FireBaseInstance.onReceiveMessage((payload) =>
      console.log(payload),
    );

    return () => unsubscribe();
  }, []);

  return <div>NotificationCenter</div>;
}
