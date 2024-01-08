import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import createFirstAppData from '../bootstrap/createFirstAppData';
import { FireBaseInstance } from '../Firebase';
import ProtectedRoute from '../router/ProtectedRoute';
import useNavigateHelper from '../hooks/useNavigateHelper';
import { workspaceListAtom } from '../utils/workspace/atom';
import { WorkspaceFallback } from './workspace';
import { Routes } from '../router/routes';

export function Bootstrap() {
  const [navigating, setNavigating] = useState(true);
  const [loading, setLoading] = useState(true);
  const { openPage } = useNavigateHelper();
  const location = useLocation();
  const isAtWorkspaceRoot = location.pathname.endsWith(Routes.workspace);

  const list = useAtomValue(workspaceListAtom);

  useLayoutEffect(() => {
    // don't redirect if we currently in a sub route, ex: workspace/quhcamz20xqas7vxro0e54ze
    if (isAtWorkspaceRoot) {
      const lastWorkspaceId = localStorage.getItem('last_workspace_id');
      const workspaceToOpen =
        list.find((w) => w.id === lastWorkspaceId) ?? list[0];
      openPage(workspaceToOpen?.id, '', true);
    }
    setNavigating(false);
  }, [list, openPage, isAtWorkspaceRoot]);

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
