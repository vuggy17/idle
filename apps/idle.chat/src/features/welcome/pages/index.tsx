import { Button, Card, Modal } from 'antd';
import Typography from 'antd/es/typography/Typography';
import NxWelcome from 'app/nx-welcome';
import { useAuth } from 'hooks/useAuth';
import { useAtom } from 'jotai';
import { Suspense, lazy, useState } from 'react';
import { LoaderFunction } from 'react-router-dom';
import { wrapErrorBoundary } from 'router/AppRouter';
import { ProtectedRoute } from 'router/ProtectedRoute';
import { currentUserAtom } from 'store/user';
const PreferencePage = lazy(() => import('features/preference/ui/pages'));

export default function Welcome() {
  const [userInfo] = useAtom(currentUserAtom);
  const { logout } = useAuth();
  const [openSettingModal, setOpenSettingModal] = useState(false);

  const logOutUser = async () => {
    await logout();
  };
  return (
    <div>
      <Card>
        <Typography>You have logged in as {userInfo.name} </Typography>
        <Button onClick={logOutUser}>Logout</Button>
        <Button onClick={() => setOpenSettingModal(true)}>Open setting</Button>
      </Card>
      <NxWelcome title={userInfo.name} />
      <Modal
        footer={null}
        open={openSettingModal}
        width={1280}
        onCancel={() => setOpenSettingModal(false)}
      >
        <Suspense fallback="Loading">
          <PreferencePage />
        </Suspense>
      </Modal>
    </div>
  );
}

export const Component = () =>
  wrapErrorBoundary(
    <ProtectedRoute>
      <Welcome />
    </ProtectedRoute>
  );
export const loader: LoaderFunction = async ({ params }) => null;
