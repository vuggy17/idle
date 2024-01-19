import { Layout } from 'antd';
import { PropsWithChildren, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import useRoomMetas from '../../../hooks/use-room-meta';
import { currentRoomIdAtom } from '../../../store/room';
import RoomList from '../components/room-list';
import { wrapErrorBoundary } from '../../../router/wrap-error-boundary';
import { waitForCurrentWorkspaceAtom } from '../../../utils/workspace/atom';
import useNavigateHelper from '../../../hooks/use-navigate-helper';

function Component({ children }: PropsWithChildren) {
  const params = useParams();
  const workspace = useAtomValue(waitForCurrentWorkspaceAtom);

  const setCurrentRoom = useSetAtom(currentRoomIdAtom);
  const list = useRoomMetas(workspace.state);
  const { jumpToRoom } = useNavigateHelper();

  useLayoutEffect(() => {
    const lastRoomId = localStorage.getItem('last_room_id');
    if (!params.roomId && lastRoomId) {
      jumpToRoom(workspace.id, lastRoomId);
    }
  }, [params, jumpToRoom, setCurrentRoom, workspace.id]);

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
