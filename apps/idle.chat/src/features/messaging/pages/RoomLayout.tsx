import { Layout } from 'antd';
import { PropsWithChildren, useCallback, useLayoutEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { ID } from '@idle/model';
import useRoomMetas from '../../../hooks/useRoomMeta';
import { currentRoomIdAtom } from '../../../store/room';
import RoomList from '../components/roomList';
import { wrapErrorBoundary } from '../../../router/wrapErrorBoundary';
import { waitForCurrentWorkspaceAtom } from '../../../utils/workspace/atom';
import useNavigateHelper from '../../../hooks/useNavigateHelper';

function Component({ children }: PropsWithChildren) {
  const match = useMatch('workspace/:workspaceId/:roomId');
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);

  const setCurrentRoom = useSetAtom(currentRoomIdAtom);
  const list = useRoomMetas(workspace.idleWorkSpace);
  const { jumpToRoom } = useNavigateHelper();

  const getRoom = useCallback(
    (id: ID) => {
      return list.find((room) => room.id === id);
    },
    [list],
  );

  useLayoutEffect(() => {
    if (match) {
      const { params } = match;
      const room = getRoom(params.roomId || '');
      if (room) {
        setCurrentRoom(room.id);
        localStorage.setItem('last_room_id', room.id);
      }
    } else {
      const lastRoomId = localStorage.getItem('last_room_id') || '';
      jumpToRoom(workspace.id, lastRoomId);
      setCurrentRoom(lastRoomId);
    }
  }, [
    match,
    setCurrentRoom,
    workspace.idleWorkSpace,
    getRoom,
    jumpToRoom,
    workspace.id,
  ]);

  return (
    <Layout className="h-full">
      <Layout.Sider theme="light" width={300}>
        <RoomList rooms={list} />
      </Layout.Sider>
      <Layout.Content className="overflow-y-auto">{children}</Layout.Content>
    </Layout>
  );
}

export const RoomLayout = ({ children }: PropsWithChildren) => {
  return wrapErrorBoundary(<Component>{children}</Component>);
};

// export const loader: LoaderFunction = async ({ params }) => null;
