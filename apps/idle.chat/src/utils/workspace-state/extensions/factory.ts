import type Workspace from '../workspace';
import type { WorkspaceOptions } from '../type';

type WorkspaceConstructor<Keys extends string> = {
  new (storeOptions: WorkspaceOptions): Omit<Workspace, Keys>;
};

export type Extension<Keys extends string> = (
  originalClass: WorkspaceConstructor<Keys>,
) => { new (storeOptions: WorkspaceOptions): unknown };

export type ExtensionReturn<Keys extends string> = (
  originalClass: WorkspaceConstructor<Keys>,
) => typeof Workspace;

export function extensionFactory<Keys extends string>(fn: Extension<Keys>) {
  return fn as ExtensionReturn<Keys>;
}
