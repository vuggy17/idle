import { useMemo } from 'react';
import { atom, useAtomValue } from 'jotai';
import groupBy from 'lodash.groupby';
import { atomWithStorage } from 'jotai/utils';
import useNavigateHelper from '../../hooks/use-navigate-helper';
import { IdleWorkspace } from '../../utils/workspace-state';
import { waitForCurrentWorkspaceAtom } from '../../utils/workspace/atom';
import { RoomMeta } from '../../utils/workspace-state/meta';
import useRoomMetas from '../../hooks/use-room-meta';

type CommandCategory = 'room' | 'recent';

type Command = {
  id: string;
  title: string;
  value: string;
  category: CommandCategory;
  run: () => void;
};

export const globalSearchQueryAtom = atom('');
export const recentRoomIdsAtom = atomWithStorage<string[]>('recent-rooms', []);

const useWorkspaceRooms = () => {
  const currentWorkspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const rooms = useRoomMetas(currentWorkspace.state);
  return rooms;
};

function useRecentRoom(): RoomMeta[] {
  const rooms = useWorkspaceRooms();
  const recentRoomIds = useAtomValue(recentRoomIdsAtom);

  return useMemo(() => {
    return recentRoomIds
      .map((roomId) => {
        const room = rooms.find((r) => r.id === roomId);
        return room;
      })
      .filter((p): p is RoomMeta => !!p);
  }, [recentRoomIds, rooms]);
}

function roomToCommand(
  category: CommandCategory,
  room: RoomMeta,
  workspace: IdleWorkspace,
  navigate: ReturnType<typeof useNavigateHelper>,
): Command {
  return {
    id: room.id,
    title: room.title,
    value: room.title,
    category,
    run: () => {
      navigate.jumpToRoom(workspace.id, room.id);
    },
  };
}

/**
 * Custom hook that returns a list of commands based on the current workspace and search query.
 * @param workspace - The current workspace object.
 * @returns Array of commands that can be used for navigation.
 */
function useRoomCommand(workspace: IdleWorkspace) {
  const recentRooms = useRecentRoom();
  const navigate = useNavigateHelper();
  const list = useRoomMetas(workspace);
  const query = useAtomValue(globalSearchQueryAtom);

  return useMemo(() => {
    const commands: Command[] = [];

    // Convert recent rooms to commands
    commands.push(
      ...recentRooms.map((room) =>
        roomToCommand('recent', room, workspace, navigate),
      ),
    );

    // Convert search results to commands
    const searchResult = workspace.indexer.room.search(query);
    for (const [key] of searchResult) {
      const roomIndex = list.findIndex((room) => room.id === key);
      if (roomIndex !== -1) {
        commands.unshift(
          roomToCommand('room', list[roomIndex], workspace, navigate),
        );
      }
    }

    return commands;
  }, [recentRooms, workspace, query, navigate, list]);
}
export function useCommandGroups() {
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const commands = useRoomCommand(workspace.state);

  return useMemo(() => {
    const groups = groupBy(commands, (command) => command.category);

    return Object.entries(groups) as [CommandCategory, Command[]][];
  }, [commands]);
}
