import { Card, Form, FormInstance, Layout, Space, Typography } from 'antd';

import { useNavigate } from 'react-router-dom';
import { AppwriteException } from 'appwrite';
import { useState } from 'react';

import { wrapErrorBoundary } from '../../../router/wrap-error-boundary';
import useAuth from '../../../services/use-auth';
import LoginForm, { LoginFormData } from '../components/login-form';
import { Routes } from '../../../router/routes';

// test user
const testUserRegisterInfo: LoginFormData = {
  email: 'devtest@gmail.com',
  password: 'alphine123',
};

function Login() {
  const [form] = Form.useForm<LoginFormData>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onUserSubmitLoginForm = async (formValues: LoginFormData) => {
    setIsLoggingIn(true);

    try {
      await login(formValues.email, formValues.password);
      navigate(`/${Routes.workspace}`);
    } catch (error) {
      onLoginFailed(error, form);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onLoginFailed = (
    error: unknown,
    formInstance: FormInstance<LoginFormData>,
  ) => {
    if (error instanceof AppwriteException) {
      if (error.type === 'user_already_exists' || error.code === 409) {
        formInstance.setFields([
          {
            name: 'email',
            errors: ['Email already taken'],
          },
        ]);
      } else if (error.code === 401) {
        switch (error.type) {
          case 'user_invalid_credentials':
            formInstance.setFields([
              {
                name: 'email',
                errors: [''],
              },
              {
                name: 'password',
                errors: ['Incorrect email or password.'],
              },
            ]);
            break;
          case 'user_blocked':
            formInstance.setFields([
              {
                name: 'email',
                errors: [''],
              },
              {
                name: 'password',
                errors: ['This account was locked by its owner.'],
              },
            ]);
            break;
        }
      } else {
        formInstance.setFields([
          {
            name: 'password',
            errors: ['Internal server error'],
          },
        ]);
      }
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

// eslint-disable-next-line import/prefer-default-export
export const Component = () => wrapErrorBoundary(<Login />);
