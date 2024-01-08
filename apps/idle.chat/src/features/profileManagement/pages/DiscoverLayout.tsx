import { Divider, Layout, Menu, MenuProps, Typography } from 'antd';
import { Suspense, useMemo } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { wrapErrorBoundary } from '../../../router/wrapErrorBoundary';
import { AppSubPages } from '../../../router/routes';

type MenuItem = Required<MenuProps>['items'][number];

function getFilterMenu(
  label: React.ReactNode,
  path: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key: path,
    icon,
    children,
    label: <Link to={path}>{label}</Link>,
  } as MenuItem;
}

const filters = [
  getFilterMenu('People', AppSubPages.discover_people),
  getFilterMenu('Invitations', AppSubPages.discover_request),
];

export function DiscoverLayout() {
  const { pathname } = useLocation();

  const currentPage = useMemo(() => {
    const paths = pathname.split('/');
    if (paths.includes(AppSubPages.discover_request)) {
      return AppSubPages.discover_request;
    }
    return '.';
  }, [pathname]);

  return (
    <Layout className="h-full">
      <Layout.Sider theme="light" width={400}>
        <div className="px-4">
          <Typography.Title level={2}>Find new friends</Typography.Title>
        </div>
        <Divider />
        <Menu
          items={filters}
          defaultSelectedKeys={[currentPage]}
          style={{
            border: 'none',
          }}
        />
      </Layout.Sider>
      <Layout.Content className="overflow-y-auto">
        <Suspense fallback="Loading page">
          <Outlet />
        </Suspense>
      </Layout.Content>
    </Layout>
  );
}

export const Component = () => wrapErrorBoundary(<DiscoverLayout />);
