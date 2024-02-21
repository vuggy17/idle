import { ID } from '@idle/model';
import { useEffect, useState } from 'react';
import { DocumentWorkspace } from '../utils/workspace-state';

export function useWorkspaceRoom(
  workspaceState: DocumentWorkspace,
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

  // useEffect(() => {
  //   console.log('effect');
  //   setTimeout(() => {
  //     if (room && !room.loaded) {
  //       room.load();
  //     }
  //   }, 1000);
  // }, [room]);

  return room;
}
