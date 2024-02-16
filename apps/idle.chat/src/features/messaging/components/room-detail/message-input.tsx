import { Input } from 'antd';
import { Emoji, PlusCircleSolid, SendDiagonal } from 'iconoir-react';
import React, { useState } from 'react';
import { useRoomHelper } from '../../hooks/useRoomMessages';
import { useAtomValue } from 'jotai';
import { currentRoomIdAtom } from 'apps/idle.chat/src/store/room';

export default function MessageInput({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState('');
  const currentRoomId = useAtomValue(currentRoomIdAtom);
  const { addMessage } = useRoomHelper(currentRoomId);
  return (
    <Input
      autoFocus
      spellCheck="false"
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="text-sm h-12"
      size="large"
      prefix={<PlusCircleSolid color="#b0b0b0" />}
      prefixCls="mx-2"
      suffix={
        <span onMouseUp={(e) => e.stopPropagation()}>
          {value ? (
            <SendDiagonal onClick={() => addMessage(`message: ${value}`)} />
          ) : (
            <Emoji color="#636363" />
          )}
        </span>
      }
    />
  );
}
