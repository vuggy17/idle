import { useAtom, useAtomValue } from 'jotai';
import { PropsWithChildren, Suspense, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import useWorkspace from '../hooks/use-workspace';
import {
  currentWorkspaceAtom,
  workspaceListAtom,
} from '../utils/workspace/atom';
import WorkspaceLayout from '../layout/workspace-layout';
import Workspace from '../utils/workspace/workspace';
import { WorkspaceMetadata } from '../utils/workspace/metadata';

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

  const getRecentWorkspace = (workspaceList: WorkspaceMetadata[]) => {
    const lastOpenWorkspaceId = localStorage.getItem('last_workspace_id');

    const index = workspaceList.findIndex(
      (workspace) => workspace.id === lastOpenWorkspaceId,
    );
    return workspaceList[index] ?? workspaceList[0];
  };

  const workspace = useWorkspace(getRecentWorkspace(list));
  useEffect(() => {
    if (!workspace) {
      setCurrentWorkspace(null);
      return;
    }

    setCurrentWorkspace(workspace);

    localStorage.setItem('last_workspace_id', workspace.id);
  }, [list, setCurrentWorkspace, workspace]);
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

Component.displayName = 'WorkspacePage';
