// import { ID } from '@idle/model';
// import { Atom, atom, useAtomValue } from 'jotai';
// import { useEffect } from 'react';
// import { DocumentWorkspace as Workspace } from '../utils/workspace-state';
// import Room from '../utils/workspace-state/room';
// import { assertExists } from '../utils/assert';

// const weakMap = new WeakMap<Workspace, Map<string, Atom<Room | null>>>();

// const emptyAtom = atom<Room | null>(null);

// function getAtom(w: Workspace, roomId: ID | null): Atom<Room | null> {
//   if (!roomId) {
//     return emptyAtom;
//   }

//   if (!weakMap.has(w)) weakMap.set(w, new Map());

//   const roomMap = weakMap.get(w);
//   if (!roomMap) throw new Error('No room found for current workspace');
//   if (!roomMap.has(roomId)) {
//     const baseAtom = atom(w.getRoom(roomId));
//     baseAtom.onMount = (set) => {
//       w.events.roomAdded.subscribe((id) => {
//         if (roomId === id) {
//           set(w.getRoom(id));
//         }
//       });
//       w.events.roomRemoved.subscribe((id) => {
//         if (roomId === id) {
//           set(null);
//         }
//       });
//       return () => {
//         w.events.roomAdded.complete();
//         w.events.roomRemoved.complete();
//       };
//     };
//     roomMap.set(roomId, baseAtom);
//     return baseAtom;
//   }
//   return roomMap.get(roomId) as Atom<Room | null>;
// }

// const loadedRooms = new WeakSet<Room>();

// export async function loadRoom(room: Room) {
//   if (loadedRooms.has(room)) {
//     return Promise.resolve();
//   }
//   loadedRooms.add(room);
//   return room.load(); // room will available in the next rerender, find this.events.roomsUpdated subscription usage
// }

// // room sau khi load sẽ không được cập nhật ngay vì atom chưa được set lại,
// // do đó cần 1 hook hỗ trợ là useRoomSafe để reload lại khi room được load hoàn tất
// export function useRoom(workspaceState: Workspace, roomID: ID) {
//   const roomAtom = getAtom(workspaceState, roomID);
//   assertExists(roomAtom)
//   const room = useAtomValue(roomAtom);

//   useEffect(() => {
//     if (room && !room.loaded) {
//       loadRoom(room).catch((err) => {
//         console.error('Failed to load room', err);
//       });
//     }
//   }, [room]);

//   return room;
// }
