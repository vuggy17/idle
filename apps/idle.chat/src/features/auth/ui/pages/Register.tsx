import { Card, Form, Layout, Space, Typography } from 'antd';

import { useSetAtom } from 'jotai';
import { currentUser } from 'store/user';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { RegisterUseCase } from 'features/auth/useCases/register';
import { AuthService } from 'services/authService';
import { AppWriteProvider } from 'providers/appwrite';
import { Account } from 'appwrite';
import { useState } from 'react';

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
// test user
const testUserRegisterInfo: RegisterFormData = {
  email: 'devtest@gmail.com',
  password: 'Zg92K2jHN8rkbW',
  confirmPassword: 'Zg92K2jHN8rkbW',
};

export default function Register() {
  const [form] = Form.useForm<RegisterFormData>();
  const [isRegistering, setIsRegistering] = useState(false);
  const setUserAtom = useSetAtom(currentUser);
  const navigate = useNavigate();
  const onUserSubmitRegisterForm = async (formValues: RegisterFormData) => {
    setIsRegistering(true);

    try {
      const authRepo = new AuthService(new Account(AppWriteProvider));
      const registerUseCase = new RegisterUseCase(authRepo);
      await registerUseCase.execute(formValues);
      setUserAtom(formValues);
      navigate('/chat');
    } catch (error) {
      console.log(
        '🚀 ~ file: Register.tsx:36 ~ onUserSubmitRegisterForm ~ error:',
        error
      );
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Layout className="h-full items-center justify-center">
      <Card>
        <Space className="w-[448px]" direction="vertical">
          <Typography.Title level={2} className="underline">
            Register for idle.chat
          </Typography.Title>
          <RegisterForm
            isPending={isRegistering}
            form={form}
            initialValues={testUserRegisterInfo}
            onFinish={onUserSubmitRegisterForm}
          />
        </Space>
      </Card>
    </Layout>
  );
}
