import { useEffect, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import createFirstAppData from '../bootstrap/createFirstAppData';
import { FireBaseInstance } from '../Firebase';
import ProtectedRoute from '../router/ProtectedRoute';
import useNavigateHelper from '../hooks/useNavigateHelper';
import { workspaceListAtom } from '../utils/workspace/atom';

export function Bootstrap() {
  // navigating and creating may be slow, to avoid flickering, we show workspace fallback
  const [navigating, setNavigating] = useState(true);
  const [loading, setLoading] = useState(false);
  const { openPage } = useNavigateHelper();
  const list = useAtomValue(workspaceListAtom);

  useLayoutEffect(() => {
    const lastWorkspaceId = localStorage.getItem('last_workspace_id');
    const workspaceToOpen =
      list.find((w) => w.id === lastWorkspaceId) ?? list[0];
    setNavigating(false);
    openPage(workspaceToOpen?.id, '', true);
  }, [list, openPage]);

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

  return loading || navigating ? (
    <div className="h-full text-center align-baseline">App loading...</div>
  ) : (
    <Outlet />
  );
}

export function Component() {
  return (
    <ProtectedRoute>
      <Bootstrap />
    </ProtectedRoute>
  );
}
