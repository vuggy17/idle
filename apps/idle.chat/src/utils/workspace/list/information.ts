import { Subject } from 'rxjs';
import Workspace from '../workspace';
import { WorkspaceMetadata } from '../metadata';
// eslint-disable-next-line import/no-cycle
import { WorkspaceListProvider, WorkspaceInfo } from './provider';

const logger = console;

const WORKSPACE_INFORMATION_CACHE_KEY = 'workspace-info--';

// eslint-disable-next-line import/prefer-default-export
export class RoomInformation {
  private _info: WorkspaceInfo = {};

  public set info(info: WorkspaceInfo) {
    if (info.avatar !== this._info.avatar || info.name !== this._info.name) {
      localStorage.setItem(
        WORKSPACE_INFORMATION_CACHE_KEY + this.meta.id,
        JSON.stringify(info),
      );
      this._info = info;
      this.onUpdated.next(info);
    }
  }

  public get info() {
    return this._info;
  }

  public onUpdated = new Subject<WorkspaceInfo>();

  constructor(
    public meta: WorkspaceMetadata,
    public provider: WorkspaceListProvider,
  ) {
    const cached = this.getCachedInformation();
    // init with cached information
    this._info = { ...cached };
  }

  /**
   * sync information with workspace
   */
  syncWithWorkspace(workspace: Workspace) {
    this._info = {
      avatar: this._info.avatar,
      name: this._info.name,
    };

    workspace.state.meta.commonFieldsUpdated.subscribe(() => {
      this.info = {
        avatar: workspace.state.meta.avatar ?? this.info.avatar,
        name: workspace.state.meta.name ?? this.info.name,
      };
    });
  }

  getCachedInformation() {
    const cache = localStorage.getItem(
      WORKSPACE_INFORMATION_CACHE_KEY + this.meta.id,
    );
    if (cache) {
      return JSON.parse(cache) as WorkspaceInfo;
    }
    return null;
  }

  /**
   * fetch information from provider
   */
  fetch() {
    this.provider
      .getInformation(this.meta.id)
      .then((info) => {
        if (info) {
          this.info = info;
        }
      })
      .catch((err: unknown) => {
        logger.warn(`get workspace information error: ${err}`);
      });
  }
}
