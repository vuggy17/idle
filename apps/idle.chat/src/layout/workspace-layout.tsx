import { Layout, theme } from 'antd';
import { PropsWithChildren } from 'react';
import WorkspaceHeader from '../components/workspace/header/workspace-header';
import WorkspaceSidebar from '../components/workspace/sidebar/workspace-sidebar';

const { useToken } = theme;

export default function WorkspaceLayout({ children }: PropsWithChildren) {
  const { token } = useToken();

  return (
    <Layout className="h-full">
      <div>
        <WorkspaceHeader />
      </div>
      <Layout
        className="h-full"
        style={{
          background: token.colorBgContainer,
        }}
        hasSider
      >
        <aside className="relative z-10 w-20">
          <WorkspaceSidebar />
        </aside>
        <Layout.Content
          className="rounded-tl-lg overflow-hidden "
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.15) -5px 4px 16px 0px',
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
