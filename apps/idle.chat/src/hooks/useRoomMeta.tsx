import { Atom, atom, useAtomValue } from 'jotai';
import uniqueId from '../utils/uniqueId';
import { IdleWorkspace } from '../utils/workspaceState';
import { RoomMeta } from '../utils/workspaceState/meta';
import workspaceManager from '../utils/workspace';

const data = [
  {
    id: '-1',
    name: `room ${-1} with long long long long long content`,
    sub: `room ${-1} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  },
  ...new Array(10).fill({}).map((_, i) => ({
    id: uniqueId(),
    name: `room ${i} with long long long long long content`,
    sub: `room ${i} sub`,
    img: 'room image',
    lastUpdatedAt: 2,
  })),
];

const weakMap = new WeakMap<IdleWorkspace, Atom<RoomMeta[]>>();

export default function useRoomMetas(workspace: IdleWorkspace): RoomMeta[] {
  if (!weakMap.has(workspace)) {
    const roomMetasAtom = atom<RoomMeta[]>(workspace.meta.roomMetas);
    weakMap.set(workspace, roomMetasAtom);
    roomMetasAtom.onMount = (set) => {
      set(workspace.meta.roomMetas);

      const subscriber = workspace.meta.roomMetasUpdated.subscribe(() => {
        set(workspace.meta.roomMetas);
      });
      return () => {
        subscriber.unsubscribe();
      };
    };
  }
  return useAtomValue(weakMap.get(workspace) as Atom<RoomMeta[]>);
}
