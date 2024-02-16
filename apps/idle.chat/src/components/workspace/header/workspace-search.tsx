import { useMemo } from 'react';
import { AutoComplete, Flex, Input, Typography } from 'antd';
import { useAtom, useAtomValue } from 'jotai';
import { useDebouncedCallback } from 'use-debounce';
import { ID } from '@idle/model';
import { waitForCurrentWorkspaceAtom } from '../../../utils/workspace/atom';
import useWorkspaceInfo from '../../../hooks/use-workspace-info';
import PartialAvatar from '../../user-card/partial-avatar';
import { RoomMeta } from '../../../utils/workspace-state/meta';
import useNavigateHelper from '../../../hooks/use-navigate-helper';
import { globalSearchQueryAtom, useCommandGroups } from './use-command-groups';

export default function WorkspaceSearch() {
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const info = useWorkspaceInfo(workspace.meta, workspace);
  const [query, setQuery] = useAtom(globalSearchQueryAtom);

  const groups = useCommandGroups();

  const options = useMemo(() => {
    return groups.map(([label, commands]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1), // capitalize first letter
      options: commands.map((command) => ({
        label: command.title,
        value: command.value,
        command,
      })),
    }));
  }, [groups]);

  return (
    <AutoComplete
      className="block"
      options={options}
      placeholder={`Search ${info.name}`}
      onSelect={(_, option) => {
        (
          option as unknown as { title: string; value: string; command: any }
        ).command.run();
      }}
    >
      <Input
        autoComplete="off"
        spellCheck="false"
        value={query}
        onChange={useDebouncedCallback((e) => setQuery(e.target.value), 300)}
      />
    </AutoComplete>
  );
}

type SearchResult = {
  rooms: RoomMeta[];
};

export function WorkspaceSearchResults({
  result,
  workspaceId,
}: {
  result: SearchResult;
  workspaceId: ID;
}) {
  const { rooms } = result;
  const { jumpToRoom } = useNavigateHelper();
  const onRoomItemClick = (roomId: ID) => jumpToRoom(workspaceId, roomId);
  return (
    <div>
      {rooms.map((room) => (
        <Flex
          align="center"
          className="min-w-0 cursor-pointer"
          onClick={() => onRoomItemClick(room.id)}
        >
          <PartialAvatar
            src={room.avatar}
            alt={room.title}
            className="shrink-0 mr-2"
          />
          <div className="flex-1 basis-0 min-w-0">
            <div className="flex">
              <Typography.Text ellipsis className="inline">
                {room.title}
              </Typography.Text>
            </div>
            <Typography.Text type="secondary" ellipsis>
              {room.members
                .map((member) => member.name.trimEnd().trimStart())
                .join(', ')}
            </Typography.Text>
          </div>
        </Flex>
      ))}
    </div>
  );
}
