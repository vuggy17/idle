import { FireBaseInstance } from '@idle/chat/Firebase';
import { useEffect } from 'react';

export function Component() {
  useEffect(() => {
    const unsubscribe = FireBaseInstance.onReceiveMessage((payload) =>
      console.log(payload),
    );

    return () => unsubscribe();
  }, []);

  return <div>NotificationCenter</div>;
}
