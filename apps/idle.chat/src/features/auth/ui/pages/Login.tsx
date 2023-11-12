import { Card, Form, Layout, Space, Typography } from 'antd';

import { LoaderFunction, useNavigate } from 'react-router-dom';
import { AuthService } from 'services/authService';
import { AppWriteProvider } from 'providers/appwrite';
import { Account, AppwriteException } from 'appwrite';
import { useState } from 'react';
import { LoginUseCase } from 'features/auth/useCases/login';
import LoginForm from '../components/LoginForm';
import { wrapErrorBoundary } from 'router/AppRouter';

export type LoginFormData = {
  email: string;
  password: string;
};

// test user
const testUserRegisterInfo: LoginFormData = {
  email: 'devtest@gmail.com',
  password: 'Zg92K2jHN8rkbW',
};

function Login() {
  const [form] = Form.useForm<LoginFormData>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const onUserSubmitLoginForm = async (formValues: LoginFormData) => {
    setIsLoggingIn(true);

    try {
      const authRepo = new AuthService(new Account(AppWriteProvider));
      const loginUseCase = new LoginUseCase(authRepo);
      await loginUseCase.execute(formValues);
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
              name: 'password',
              errors: ['Internal server error'],
            },
          ]);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Layout className="h-full items-center justify-center">
      <Space className="w-[448px]" direction="vertical">
        <Card className="flex-col">
          <Space className="w-full" direction="vertical">
            <Typography.Title level={2} className="underline">
              Sign in to idle.app{' '}
              <span role="img" aria-label="airplane icon">
                ✈️
              </span>
            </Typography.Title>
            <LoginForm
              isPending={isLoggingIn}
              form={form}
              initialValues={testUserRegisterInfo}
              onFinish={onUserSubmitLoginForm}
            />
          </Space>
        </Card>
        <Card>
          <Typography>
            New to Idle?
            <Typography.Link href="register">
              {' '}
              Create an account
            </Typography.Link>
          </Typography>
        </Card>
      </Space>
    </Layout>
  );
}

export const Component = () => wrapErrorBoundary(<Login />);

Component.displayName = 'Register page';

export const loader: LoaderFunction = async ({ params }) => null;
