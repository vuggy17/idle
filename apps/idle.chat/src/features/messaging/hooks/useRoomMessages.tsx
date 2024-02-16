import { useWorkspaceRoom } from 'apps/idle.chat/src/hooks/use-workspace-room';
import { waitForCurrentWorkspaceAtom } from 'apps/idle.chat/src/utils/workspace/atom';
import { useAtomValue } from 'jotai';
import { useCallback, useMemo } from 'react';

export function useRoomHelper(roomId: string) {
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const currentRoom = useWorkspaceRoom(workspace.state, roomId);

  const addMessage = useCallback(
    (text: string) => {
      currentRoom?.addMessage({
        text,
      });
    },
    [currentRoom],
  );
  return useMemo(
    () => ({
      addMessage,
    }),
    [],
  );
}
