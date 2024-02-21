import { Subject } from 'rxjs';
import { throwIfAborted } from '../utils/throw-if-aborted';
import type { BlobEngine } from './blob';
import type { SyncEngine, SyncEngineStatus } from '../sync';

export interface WorkspaceEngineStatus {
  sync: SyncEngineStatus;
}

/**
 * # WorkspaceEngine
 *
 * sync ydoc, blob, awareness together
 */
export class WorkspaceEngine {
  _status: WorkspaceEngineStatus;

  onStatusChange = new Subject<WorkspaceEngineStatus>();

  get status() {
    return this._status;
  }

  set status(status: WorkspaceEngineStatus) {
    this._status = status;
    this.onStatusChange.next(status);
  }

  constructor(
    public blob: BlobEngine,
    public sync: SyncEngine,
  ) {
    this._status = {
      sync: sync.status,
    };
    sync.onStatusChange.subscribe((status) => {
      this.status = {
        sync: status,
      };
    });
  }

  start() {
    this.sync.start();
    this.blob.start();
  }

  canGracefulStop() {
    return this.sync.canGracefulStop();
  }

  async waitForGracefulStop(abort?: AbortSignal) {
    await this.sync.waitForGracefulStop(abort);
    throwIfAborted(abort);
    this.forceStop();
  }

  forceStop() {
    this.sync.forceStop();
    this.blob.stop();
  }
}

export * from './blob';
export * from '../sync';
