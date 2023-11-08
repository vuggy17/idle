import { Input, Form, FormProps, Button } from 'antd';
import { LoginFormData } from '../pages/Login';

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
        label="Password"
        rules={[
          {
            required: true,
            message : 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password placeholder="Your password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
}
