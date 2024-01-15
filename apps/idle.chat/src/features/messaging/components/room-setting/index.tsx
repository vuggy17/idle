import { Button, Drawer, Layout } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { ID } from '@idle/model';
import { useAtomValue, useSetAtom } from 'jotai';
import { waitForCurrentWorkspaceAtom } from '../../../../utils/workspace/atom';
import useNavigateHelper from '../../../../hooks/use-navigate-helper';
import { NIL, currentRoomIdAtom } from '../../../../store/room';

export type RoomSettingRef = {
  open: () => void;
};

type RoomSettingProps = {
  name: string;
  roomId: ID;
};

export const RoomSetting = forwardRef<RoomSettingRef, RoomSettingProps>(
  function RoomSetting({ name, roomId }, ref) {
    const [open, setOpen] = useState(false);
    const workspace = useAtomValue(waitForCurrentWorkspaceAtom);
    const { jumpToWorkspace } = useNavigateHelper();
    const setCurrentRoomAtom = useSetAtom(currentRoomIdAtom);

    const onClose = () => {
      setOpen(false);
    };

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
      }),
      [],
    );

    const deleteRoom = () => {
      setCurrentRoomAtom(NIL);
      localStorage.removeItem('last_room_id');
      jumpToWorkspace(workspace.id);

      workspace.idleWorkSpace.removeRoom(roomId);
    };

    return (
      <Drawer
        title={name}
        maskStyle={{
          backgroundColor: 'transparent',
        }}
        placement="right"
        size="large"
        onClose={onClose}
        open={open}
      >
        <Layout className="h-full">
          <Layout.Content className="h-full">
            <Button onClick={deleteRoom}>Delete chat</Button>
          </Layout.Content>
        </Layout>
      </Drawer>
    );
  },
);
