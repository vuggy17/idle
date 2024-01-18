import { Tooltip } from 'antd';
import WorkspaceFlavour from '../../utils/workspace/list/workspace-flavour';
import useWorkspaceInfo from '../../hooks/use-workspace-info';
import PartialAvatar from '../user-card/partial-avatar';

type WorkspaceInfoProps = {
  metadata: {
    id: string;
    flavour: WorkspaceFlavour;
  };
};

export default function WorkspaceInfo({ metadata }: WorkspaceInfoProps) {
  const information = useWorkspaceInfo(metadata);
  return (
    <Tooltip title={information.name}>
      <PartialAvatar
        alt={information.name || ''}
        shape="square"
        src={information.avatar || ' https://placehold.co/600x400'}
        size={52}
        className="mx-auto mb-6 hover:cursor-pointer"
      />
    </Tooltip>
  );
}
