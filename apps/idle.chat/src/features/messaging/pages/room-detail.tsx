import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { currentRoomIdAtom } from 'apps/idle.chat/src/store/room';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { ID } from '@idle/model';
import { IdleWorkspace as Workspace } from 'apps/idle.chat/src/utils/workspace-state';
import { RoomLayout } from './room-layout';
import { waitForCurrentWorkspaceAtom } from '../../../utils/workspace/atom';
import RoomDetailHeader from '../components/room-detail/room-detail-header';
import RoomDetail from '../components/room-detail/room-detail';

const useForceUpdate = () => {
  const [, setCount] = useState(0);
  return useCallback(() => setCount((count) => count + 1), []);
};

const useSafeRoom = (workspaceState: Workspace, roomId: string) => {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const disposable = workspaceState.events.roomsUpdated.subscribe(() => {
      forceUpdate();
    });
    return () => disposable.unsubscribe();
  }, [roomId, workspaceState.events.roomsUpdated, forceUpdate]);

  return workspaceState.getRoom(roomId);
};

function RoomDetailPage({ roomId }: { roomId: ID }) {
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
  const room = useSafeRoom(workspace.state, roomId);

  if (!room) return 'page not found';
  return (
    <Layout>
      <Layout.Header className="bg-transparent px-0">
        <RoomDetailHeader room={room} workspace={workspace.state} />
      </Layout.Header>
      <Layout.Content className="h-full">
        <RoomDetail workspace={workspace.state} roomId={roomId} />
      </Layout.Content>
    </Layout>
  );
}
export function Component() {
  const setCurrentRoomId = useSetAtom(currentRoomIdAtom);
  const params = useParams();

  useEffect(() => {
    if (params.roomId) {
      localStorage.setItem('last_room_id', params.roomId);
      setCurrentRoomId(params.roomId);
    }
  }, [params, setCurrentRoomId]);

  const { roomId } = params;
  return (
    <RoomLayout>
      <Suspense>{roomId ? <RoomDetailPage roomId={roomId} /> : null}</Suspense>
    </RoomLayout>
  );
}

Component.displayName = 'RoomDetailPage';
