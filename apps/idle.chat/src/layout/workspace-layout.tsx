import { Layout } from 'antd';
import { PropsWithChildren } from 'react';
import WorkspaceHeader from '../components/workspace-header/workspace-header';
import RootAppSidebar from '../components/root-app-sidebar/root-app-sidebar';

export default function WorkspaceLayout({ children }: PropsWithChildren) {
  return (
    <Layout className="h-full">
      <div>
        <WorkspaceHeader />
      </div>
      <Layout className="h-full" hasSider>
        <aside className="relative z-10 w-20">
          <RootAppSidebar />
        </aside>
        <Layout.Content>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
