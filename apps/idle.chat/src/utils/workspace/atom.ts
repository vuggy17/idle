import { atomWithObservable } from 'jotai/utils';
import { Observable } from 'rxjs';
import { atom } from 'jotai';
import { WorkspaceMetadata } from './metadata';
import workspaceManagerInstance from '.';
import Workspace from './workspace';

const logger = console;
export const workspaceManagerAtom = atom(() => workspaceManagerInstance);

export const workspaceListAtom = atomWithObservable<WorkspaceMetadata[]>(
  (get) => {
    const manager = get(workspaceManagerAtom);
    return new Observable<WorkspaceMetadata[]>((subscriber) => {
      subscriber.next(manager.list.workspaceList);

      return manager.list.onStatusChanged.subscribe((status) => {
        console.log('status', status);
        subscriber.next(status.workspaceList);
      });
    });
  },
  {
    initialValue: [],
  },
);

// workspace list loading status, if is false, UI can display not found page when workspace id is not in the list.
export const workspaceListLoadingStatusAtom = atomWithObservable<boolean>(
  (get) => {
    const workspaceManager = get(workspaceManagerAtom);
    return new Observable<boolean>((subscriber) => {
      subscriber.next(workspaceManager.list.status.loading);
      return workspaceManager.list.onStatusChanged.subscribe((status) => {
        subscriber.next(status.loading);
      }).unsubscribe;
    });
  },
  {
    initialValue: true,
  },
);

// current workspace
export const currentWorkspaceAtom = atom<Workspace | null>(null);

// wait for current workspace, if current workspace is null, it will suspend
export const waitForCurrentWorkspaceAtom = atom((get) => {
  const currentWorkspace = get(currentWorkspaceAtom);
  console.log('current', currentWorkspace);
  if (!currentWorkspace) {
    console.log('su');
    // suspended
    logger.info('suspended for current workspace');
    return new Promise<Workspace>((_) => {});
  }
  return currentWorkspace;
});
