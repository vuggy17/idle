import { Input } from 'antd';
import { Emoji, PlusCircleSolid, SendDiagonal } from 'iconoir-react';
import React, { useState } from 'react';

export default function MessageInput({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState('');
  return (
    <Input
      autoFocus
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="text-sm h-12"
      size="large"
      prefix={<PlusCircleSolid color="#b0b0b0" />}
      prefixCls="mx-2"
      suffix={value ? <SendDiagonal /> : <Emoji color="#636363" />}
    />
  );
}
