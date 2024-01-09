import React from 'react';
import { NxWelcome } from '../../../app/nx-welcome';
import { RoomLayout } from './RoomLayout';

export function Component() {
  return (
    <RoomLayout>
      <NxWelcome title="No room selected" />;
    </RoomLayout>
  );
}

Component.displayName = 'NoRoom';
