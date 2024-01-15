import { createLocalRoomListProvider } from './impl/local/list';
import { localWorkspaceFactory } from './impl/local/workspace-factory';
import { WorkspaceList } from './list';
import WorkspaceManager from './manager';

const list = new WorkspaceList([createLocalRoomListProvider()]);

const workspaceManager = new WorkspaceManager(list, [localWorkspaceFactory]);

export default workspaceManager;
