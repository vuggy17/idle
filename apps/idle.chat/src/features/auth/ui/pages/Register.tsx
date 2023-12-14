import { Card, Form, Layout, Space, Typography } from 'antd';

import { useSetAtom } from 'jotai';
import { currentUserAtom } from '@idle/chat/store/user';
import { useNavigate } from 'react-router-dom';
import RegisterUseCase from '@idle/chat/features/auth/useCases/register';
import { AppwriteException } from 'appwrite';
import { useState } from 'react';
import { wrapErrorBoundary } from '@idle/chat/router/wrapErrorBoundary';
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
  const navigate = useNavigate();

  const onUserSubmitRegisterForm = async (formValues: RegisterFormData) => {
    setIsRegistering(true);

    try {
      const registerUseCase = new RegisterUseCase();
      await registerUseCase.execute(formValues);
      navigate('/login');
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === 'user_already_exists' || error.code === 409) {
          form.setFields([
            {
              name: 'email',
              errors: ['Email already taken'],
            },
          ]);
        }
        if (error.type === 'user_blocked' || error.code === 401) {
          form.setFields([
            {
              name: 'email',
              errors: [
                'This account is locked by its owner, please reopen account to login',
              ],
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

// eslint-disable-next-line import/prefer-default-export
export const Component = () => {
  return wrapErrorBoundary(<Register />);
};
