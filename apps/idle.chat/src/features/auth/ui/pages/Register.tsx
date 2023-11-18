import { Card, Form, Layout, Space, Typography } from 'antd';

import { useSetAtom } from 'jotai';
import { currentUserAtom } from 'store/user';
import { LoaderFunction, useNavigate } from 'react-router-dom';
import RegisterUseCase from 'features/auth/useCases/register';
import AuthService from 'services/authService';
import { AppWriteProvider } from 'providers/appwrite';
import { Account, AppwriteException } from 'appwrite';
import { useState } from 'react';
import { wrapErrorBoundary } from 'router/AppRouter';
import RegisterForm, { RegisterFormData } from '../components/RegisterForm';

// test user
const testUserRegisterInfo: RegisterFormData = {
  name: 'appwrite dev',
  email: 'devtest@gmail.com',
  password: 'Zg92K2jHN8rkbW',
  confirmPassword: 'Zg92K2jHN8rkbW',
};

function Register() {
  const [form] = Form.useForm<RegisterFormData>();
  const [isRegistering, setIsRegistering] = useState(false);
  const setUserAtom = useSetAtom(currentUserAtom);
  const navigate = useNavigate();

  const onUserSubmitRegisterForm = async (formValues: RegisterFormData) => {
    setIsRegistering(true);

    try {
      const authRepo = new AuthService(new Account(AppWriteProvider));
      const registerUseCase = new RegisterUseCase(authRepo);
      const newUser = await registerUseCase.execute(formValues);
      setUserAtom(newUser);
      navigate('/welcome');
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === 'user_already_exists' || error.code === 409) {
          form.setFields([
            {
              name: 'email',
              errors: ['Email already taken'],
            },
          ]);
        } else {
          form.setFields([
            {
              name: 'email',
              errors: ['Internal server error'],
            },
          ]);
        }
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout className="h-full items-center justify-center">
      <Space className="w-[448px]" direction="vertical">
        <Card>
          <Space className="w-full" direction="vertical">
            <Typography.Title level={2} className="underline">
              Register for idle.app
            </Typography.Title>
            <RegisterForm
              isPending={isRegistering}
              form={form}
              initialValues={testUserRegisterInfo}
              onFinish={onUserSubmitRegisterForm}
            />
          </Space>
        </Card>
        <Card>
          <Typography>
            Already have an account?
            <Typography.Link href="login">
              {' '}
              Sign in{' '}
              <span role="img" aria-label="airplane icon">
                ✈️
              </span>
            </Typography.Link>
          </Typography>
        </Card>
      </Space>
    </Layout>
  );
}

export const Component = () => wrapErrorBoundary(<Register />);

Component.displayName = 'Register page';

export const loader: LoaderFunction = async ({ params }) => null;
