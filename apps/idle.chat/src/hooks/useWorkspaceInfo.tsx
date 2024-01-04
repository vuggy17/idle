import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { workspaceManagerAtom } from '../utils/workspace/atom';
import { WorkspaceMetadata } from '../utils/workspace/metadata';
import Workspace from '../utils/workspace/workspace';

export default function useWorkspaceInfo(
  meta: WorkspaceMetadata,
  workspace?: Workspace,
) {
  const workspaceManager = useAtomValue(workspaceManagerAtom);

  const [information, setInformation] = useState(
    () => workspaceManager.list.getInformation(meta).info,
  );

  useEffect(() => {
    const workspaceInformation = workspaceManager.list.getInformation(meta);

    setInformation(workspaceInformation.info);
    return workspaceInformation.onUpdated
      .subscribe((info) => {
        setInformation(info);
      })
      .unsubscribe();
  }, [meta, workspace, workspaceManager]);

  return information;
}
