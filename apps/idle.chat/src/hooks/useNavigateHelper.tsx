import { ID } from '@idle/model';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useNavigateHelper() {
  const navigate = useNavigate();
  const jumpToPage = useCallback(
    (workspaceId: ID, pageId: ID) => {
      navigate(`/workspace/${workspaceId}/${pageId}}`);
    },
    [navigate],
  );

  const openPage = useCallback(
    (workspaceId: ID, pageId: ID, skipPage = false) => {
      if (skipPage) navigate(`/workspace/${workspaceId}`);
      else {
        navigate(`/workspace/${workspaceId}/${pageId}`);
      }
    },
    [navigate],
  );
  return useMemo(
    () => ({
      jumpToPage,
      openPage,
    }),
    [jumpToPage, openPage],
  );
}
