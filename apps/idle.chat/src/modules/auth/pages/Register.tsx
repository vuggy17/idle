import { Card, Form, Layout, Space, Typography } from 'antd';
import RegisterForm from './components/RegisterForm';
import { useSetAtom } from 'jotai';
import { currentUser } from 'store/user';
import { useNavigate } from 'react-router-dom';

export type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
// test user
const testUserRegisterInfo: RegisterFormData = {
  email: 'devtest@gmail.com',
  password: '1',
  confirmPassword: '1',
};

export default function Register() {
  const [form] = Form.useForm<RegisterFormData>();
  const setUserAtom = useSetAtom(currentUser);
  const navigate = useNavigate();
  const onUserSubmitRegisterForm = (formValues: RegisterFormData) => {
    setUserAtom(formValues);
    navigate("/chat")
  };

  return (
    <Layout className="h-full items-center justify-center">
      <Card>
        <Space className="w-[448px]" direction="vertical">
          <Typography.Title level={2} className="underline">
            Register for idle.chat
          </Typography.Title>
          <RegisterForm
            form={form}
            initialValues={testUserRegisterInfo}
            onFinish={onUserSubmitRegisterForm}
          />
        </Space>
      </Card>
    </Layout>
  );
}
