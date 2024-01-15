import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { workspaceManagerAtom } from '../utils/workspace/atom';
import Workspace from '../utils/workspace/workspace';
import { WorkspaceMetadata } from '../utils/workspace/metadata';

export default function useWorkspace(meta: WorkspaceMetadata | null) {
  const workspaceManager = useAtomValue(workspaceManagerAtom);

  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  useEffect(() => {
    let ref: ReturnType<typeof workspaceManager.use> | null = null;

    if (!meta) {
      setWorkspace(null); // set to null if meta is null or undefined
    } else {
      ref = workspaceManager.use(meta);
      setWorkspace(ref.workspace);
    }
    return () => {
      ref?.release();
    };
  }, [meta, workspaceManager]);

  return workspace;
}
