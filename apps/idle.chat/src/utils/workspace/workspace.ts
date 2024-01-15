import { Subject } from 'rxjs';
import { WorkspaceMetadata } from './metadata';
import { IdleWorkspace } from '../workspace-state';
import { WorkspaceEngine, WorkspaceEngineStatus } from './engine';

const logger = console;

export type WorkspaceStatus = {
  mode: 'ready' | 'closed';
  engine: WorkspaceEngineStatus;
  // upgrade: WorkspaceUpgradeStatus;
};

export default class Workspace {
  get id() {
    return this.meta.id;
  }

  get flavour() {
    return this.meta.flavour;
  }

  private _status: WorkspaceStatus;

  /**
   * event on workspace stop, workspace is one-time use, so it will be triggered only once
   */
  onStop = new Subject<void>();

  onStatusChange = new Subject<WorkspaceStatus>();

  get status() {
    return this._status;
  }

  set status(status: WorkspaceStatus) {
    this._status = status;
    this.onStatusChange.next(status);
  }

  constructor(
    public meta: WorkspaceMetadata,
    public engine: WorkspaceEngine,
    public idleWorkSpace: IdleWorkspace,
  ) {
    this._status = {
      mode: 'closed',
      engine: engine.status,
      // upgrade: this.upgrade.status,
    };
    this.engine.onStatusChange.subscribe((status) => {
      this.status = {
        ...this.status,
        engine: status,
      };
    });

    this.start();
  }

  /**
   * workspace start when create and workspace is one-time use
   */
  private start() {
    if (this.status.mode === 'ready') {
      return;
    }
    logger.info('start workspace', this.id);
    this.engine.start();
    this.status = {
      ...this.status,
      mode: 'ready',
      engine: this.engine.status,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  canGracefulStop() {
    // return true;
    return this.engine.canGracefulStop();
    // return this.engine.canGracefulStop() && !this.status.upgrade.upgrading;
  }

  forceStop() {
    if (this.status.mode === 'closed') {
      return;
    }
    logger.info('stop workspace', this.id);
    this.engine.forceStop();
    this.status = {
      ...this.status,
      mode: 'closed',
      engine: this.engine.status,
    };
    this.onStop.next();
  }

  // dung cai nay de uu tien sync active workspace truoc, target la id cua workspace hien tai
  // same as `WorkspaceEngine.sync.setPriorityRule`
  // eslint-disable-next-line class-methods-use-this
  setPriorityRule(target: ((id: string) => boolean) | null) {
    this.engine.sync.setPriorityRule(target);
  }
}
