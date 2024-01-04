import { createLocalRoomListProvider } from './impl/local/list';
import { WorkspaceList } from './list';
import WorkspaceManager from './manager';

const list = new WorkspaceList([createLocalRoomListProvider()]);

const workspaceManager = new WorkspaceManager(list, []);

export default workspaceManager;
