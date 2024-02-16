import { ID } from '@idle/model';
import { useEffect, useState } from 'react';
import { IdleWorkspace } from '../utils/workspace-state';

export function useWorkspaceRoom(
  workspaceState: IdleWorkspace,
  roomId: ID | null,
) {
  const [room, setRoom] = useState(
    roomId ? workspaceState.getRoom(roomId) : null,
  );

  useEffect(() => {
    const sub1 = workspaceState.events.roomAdded.subscribe((id) => {
      if (roomId === id) {
        setRoom(workspaceState.getRoom(id));
      }
    });
    const sub2 = workspaceState.events.roomRemoved.subscribe((id) => {
      if (roomId === id) {
        setRoom(null);
      }
    });
    return () => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    };
  }, [workspaceState, roomId]);

  useEffect(() => {
    if (room && !room.loaded) {
      room.load().catch((err) => {
        console.error('Failed to load room', err);
      });
    }
  }, [room]);

  return room;
}
