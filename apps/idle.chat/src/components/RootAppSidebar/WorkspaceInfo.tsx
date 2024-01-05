/* eslint-disable @nx/enforce-module-boundaries */
import WorkspaceFlavour from '@idle/chat/utils/workspace/list/workspaceFlavour';
import { Tooltip } from 'antd';
import React from 'react';
import useWorkspaceInfo from '@idle/chat/hooks/useWorkspaceInfo';
import PartialAvatar from '../UserCard/PartialAvatar';

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
        shape="square"
        src={information.avatar || ' https://placehold.co/600x400'}
        size={52}
        className="mx-auto mb-6 hover:cursor-pointer"
      />
    </Tooltip>
  );
}
