import { Button, Form, FormProps, Input } from 'antd';
import { RegisterFormData } from '../Register';

type RegisterFormProps = FormProps<RegisterFormData> & {
  isPending?: boolean;
};

/**
 *
 * @param formConfig: atnd form props
 * @returns
 */
export default function RegisterForm({
  isPending,
  ...formConfig
}: RegisterFormProps) {
  return (
    <Form {...formConfig} layout="vertical" scrollToFirstError>
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The new password that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button loading={isPending} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
