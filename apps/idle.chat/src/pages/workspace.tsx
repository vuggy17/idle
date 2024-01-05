import { useAtom, useAtomValue } from 'jotai';
import { PropsWithChildren, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import useWorkspace from '../hooks/useWorkspace';
import {
  currentWorkspaceAtom,
  workspaceListAtom,
} from '../utils/workspace/atom';
import WorkspaceLayout from '../layout/WorkspaceLayout';

const { useToken } = theme;

function SideBarConfig({ children }: PropsWithChildren) {
  const { token } = useToken();

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: token.colorBgLayout,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export function WorkspaceFallback() {
  return (
    <div className="h-full text-center align-middle">Loading workspace</div>
  );
}

export function Component() {
  // only write to this atom here, don't use useSetAtom since we need the component tree to refresh when the current atom changed!
  // eslint-disable-next-line
  const [_, setCurrentWorkspace] = useAtom(currentWorkspaceAtom);
  const list = useAtomValue(workspaceListAtom);

  // read last workspace from path, then open it instead
  const firstWorkspaceMeta = list[0];
  const workspace = useWorkspace(firstWorkspaceMeta);
  useEffect(() => {
    if (!workspace) {
      setCurrentWorkspace(null);
      return;
    }

    setCurrentWorkspace(workspace);

    localStorage.setItem('last_workspace_id', workspace.id);
  }, [firstWorkspaceMeta, list, setCurrentWorkspace, workspace]);
  return (
    <Suspense fallback={<WorkspaceFallback />}>
      <SideBarConfig>
        <WorkspaceLayout>
          <Outlet />
        </WorkspaceLayout>
      </SideBarConfig>
    </Suspense>
  );
}
