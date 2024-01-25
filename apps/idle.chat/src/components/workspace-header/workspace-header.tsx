import { Skeleton } from 'antd';
import { Suspense } from 'react';
import WorkspaceSearch from './workspace-search';

export default function WorkspaceHeader() {
  return (
    <div className="py-2">
      <div className="max-w-xl mx-auto">
        <Suspense fallback={<Skeleton.Input block />}>
          <WorkspaceSearch />
        </Suspense>
      </div>
    </div>
  );
}
