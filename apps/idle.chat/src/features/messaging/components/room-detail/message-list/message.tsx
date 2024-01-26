import PartialAvatar from '@chat/components/user-card/partial-avatar';
import { Flex, FlexProps, Typography, theme } from 'antd';
import { cx } from 'antd-style';
import { User } from 'apps/idle.chat/src/features/auth/entities/user';
import { PropsWithChildren, ReactNode } from 'react';

const { useToken } = theme;

type MessageProps = {
  self: boolean;
  content: string;
  author: User;
};
export default function Message({ self, content, author }: MessageProps) {
  return (
    <MessageLayoutOuter
      content={<Typography.Text>{content}</Typography.Text>}
      thumbnail={<PartialAvatar src={author.avatar} alt={author.name} />}
      Layout={self ? MessageLayoutSelf : MessageLayout}
    />
  );
}

function MessageLayoutOuter({
  thumbnail,
  content,
  Layout,
}: {
  thumbnail: ReactNode;
  content: ReactNode;
  Layout: any;
}) {
  return (
    <Layout>
      {thumbnail}
      {content}
    </Layout>
  );
}

function CommonMessageRow({
  children,
  className,
  ...props
}: PropsWithChildren<Omit<FlexProps, 'algin' | 'gap'>>) {
  // hover:bg-[#0000000f]"
  const mergedCls = cx(className, "py-1 px-3 mx-1 rounded");
  return (
    <Flex align="center" className={mergedCls} gap={8} {...props}>
      {children}
    </Flex>
  );
}

function MessageLayout({ children }: PropsWithChildren) {
  return (
    <div >
      <CommonMessageRow>{children}</CommonMessageRow>
    </div>
  );
}

function MessageLayoutSelf({ children }: PropsWithChildren) {
  return (
      <CommonMessageRow justify="right" className="flex-row-reverse">
        {children}
      </CommonMessageRow>
  );
}
