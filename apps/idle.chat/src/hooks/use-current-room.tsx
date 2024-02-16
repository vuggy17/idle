import { useAtomValue } from 'jotai';
import { currentRoomIdAtom } from '../store/room';
import { waitForCurrentWorkspaceAtom } from '../utils/workspace/atom';
import { useWorkspaceRoom } from './use-workspace-room';

export function useCurrentRoom() {
  const currentRoomId = useAtomValue(currentRoomIdAtom);
  const currentWorkspace = useAtomValue(waitForCurrentWorkspaceAtom);
  return useWorkspaceRoom(currentWorkspace?.state, currentRoomId);
}
