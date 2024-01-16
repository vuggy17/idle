import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import createFirstAppData from '../bootstrap/create-first-app-data';
import { FireBaseInstance } from '../firebase';
import ProtectedRoute from '../router/protected-route';
import useNavigateHelper from '../hooks/use-navigate-helper';
import { workspaceListAtom } from '../utils/workspace/atom';
import { WorkspaceFallback } from './workspace';
import { Routes } from '../router/routes';

export function Bootstrap() {
  const [navigating, setNavigating] = useState(true);
  const [loading, setLoading] = useState(true);
  const { jumpToWorkspace } = useNavigateHelper();
  const location = useLocation();
  const isAtWorkspaceRoot = location.pathname === `/${Routes.workspace}`;

  const list = useAtomValue(workspaceListAtom);

  useLayoutEffect(() => {
    // don't redirect if we currently in a sub route, ex: workspace/quhcamz20xqas7vxro0e54ze
    if (isAtWorkspaceRoot) {
      const lastWorkspaceId = localStorage.getItem('last_workspace_id');
      const workspaceToOpen =
        list.find((w) => w.id === lastWorkspaceId) ?? list[0];
      jumpToWorkspace(workspaceToOpen?.id);
    }
    setNavigating(false);
  }, [list, jumpToWorkspace, isAtWorkspaceRoot]);

  useEffect(() => {
    FireBaseInstance.start();
    createFirstAppData()
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return loading || navigating ? <WorkspaceFallback /> : <Outlet />;
}

export function Component() {
  return (
    <ProtectedRoute>
      <Bootstrap />
    </ProtectedRoute>
  );
}
