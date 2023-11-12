import { Input, Form, FormProps, Button, Space, Typography } from 'antd';
import { LoginFormData } from '../pages/Login';
import "./loginForm.css"

type LoginFormProps = FormProps<LoginFormData> & {
  isPending?: boolean;
};

export default function LoginForm({
  isPending,
  ...formConfig
}: LoginFormProps) {
  return (
    <Form {...formConfig} layout="vertical" scrollToFirstError>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input placeholder="Your email" />
      </Form.Item>

      <Form.Item
        name="password"
        id="loginForm_password"
        className='loginForm_password'
        label={
          <Space className="justify-between w-full">
            <Typography.Text>Password</Typography.Text>
            <Typography.Link href='/register'>Forgot password?</Typography.Link>
          </Space>
        }
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
}
