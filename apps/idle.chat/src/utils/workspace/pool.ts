import Workspace from './workspace';

const logger = console;

/**
 * Collection of opened workspace. use reference counting to manage active workspace.
 */
// eslint-disable-next-line import/prefer-default-export
export class WorkspacePool {
  openedWorkspace = new Map<string, { workspace: Workspace; rc: number }>();

  timeoutToGc: NodeJS.Timeout | null = null;

  get(workspaceId: string): {
    workspace: Workspace;
    release: () => void;
  } | null {
    const exist = this.openedWorkspace.get(workspaceId);
    if (exist) {
      exist.rc += 1;
      let released = false;
      return {
        workspace: exist.workspace,
        release: () => {
          // avoid double release
          if (released) {
            return;
          }
          released = true;
          exist.rc -= 1;
          this.requestGc();
        },
      };
    }
    return null;
  }

  put(workspace: Workspace) {
    const ref = { workspace, rc: 0 };
    this.openedWorkspace.set(workspace.meta.id, ref);

    const r = this.get(workspace.meta.id);
    if (!r) {
      throw new Error('GC: Unreachable');
    }

    return r;
  }

  private requestGc() {
    if (this.timeoutToGc) {
      clearInterval(this.timeoutToGc);
    }

    // do gc every 1s
    this.timeoutToGc = setInterval(() => {
      this.gc();
    }, 1000);
  }

  private gc() {
    for (const [id, { workspace, rc }] of new Map(
      this.openedWorkspace /* clone the map, because the origin will be modified during iteration */,
    )) {
      if (rc === 0 && workspace.canGracefulStop()) {
        // we can safely close the workspace
        logger.info(`close workspace [${workspace.flavour}] ${workspace.id}`);
        workspace.forceStop();

        this.openedWorkspace.delete(id);
      }
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, { rc }] of this.openedWorkspace) {
      if (rc === 0) {
        return;
      }
    }

    // if all workspaces has referrer, stop gc
    if (this.timeoutToGc) {
      clearInterval(this.timeoutToGc);
    }
  }
}
