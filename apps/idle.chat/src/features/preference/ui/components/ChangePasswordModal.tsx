import {
  Button,
  ConfigProvider,
  Flex,
  Form,
  FormInstance,
  Input,
  Modal,
  ModalProps,
  Space,
  Typography,
} from 'antd';
import { Account, AppwriteException } from 'appwrite';
import ChangePasswordUseCase from 'features/auth/useCases/changePassword';
import { PasswordCursor } from 'iconoir-react';
import { AppWriteProvider } from 'providers/appwrite';
import { useState } from 'react';
import AuthService from 'services/authService';

type ChangePasswordForm = {
  password: string;
  newPass: string;
  confirm: string;
};
type ChangePasswordModalProps = ModalProps;

const { useForm } = Form;
export default function ChangePasswordModal({
  ...modalProps
}: ChangePasswordModalProps) {
  const [form] = useForm<ChangePasswordForm>();
  const { onOk, width, footer, centered } = modalProps;
  const [loading, setLoading] = useState(false);

  const onPasswordSubmitFailed = (
    error: unknown,
    formInstance: FormInstance<ChangePasswordForm>,
  ) => {
    if (error instanceof AppwriteException) {
      if (error.type === 'user_invalid_credentials' || error.code === 401) {
        formInstance.setFields([
          {
            name: 'password',
            errors: ['Please enter your old password!'],
          },
        ]);
      } else if (
        error.type === 'general_argument_invalid' &&
        error.code === 400
      ) {
        formInstance.setFields([
          {
            name: 'newPass',
            errors: ['Password should use at least 1 special character'],
          },
          {
            name: 'confirm',
            errors: ['Password should use at least 1 special character'],
          },
        ]);
      } else {
        formInstance.setFields([
          {
            name: 'password',
            errors: [''],
          },
          {
            name: 'newPass',
            errors: [''],
          },
          {
            name: 'confirm',
            errors: ['Internal server error'],
          },
        ]);
      }
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);

    try {
      const executor = new ChangePasswordUseCase();
      await executor.execute({
        currentPass: data.password,
        newPass: data.newPass,
      });

      setTimeout(() => {
        onOk?.({} as React.MouseEvent<HTMLButtonElement>);
      }, 300);
    } catch (error) {
      onPasswordSubmitFailed(error, form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      {...modalProps}
      width={width ?? 360}
      footer={footer ?? null}
      centered={centered || true}
      title={
        <Space direction="vertical" className="w-full items-center font-normal">
          <PasswordCursor />
          <Flex vertical className="text-center">
            <Typography.Text strong>Change password</Typography.Text>
            <Typography.Text
              type="secondary"
              className="tracking-tight text-sm  "
            >
              Use a password at least 15 letters long, or at least 8 characters
              long with both letters and numbers. If you lose access to your
              school email address, you&apos;ll be able to log in using your
              password.
            </Typography.Text>
          </Flex>
        </Space>
      }
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              itemMarginBottom: 16,
            },
          },
          token: {
            colorTextDescription: 'rgba(0, 0, 0, 0.60)',
          },
        }}
      >
        <Form
          preserve={false}
          form={form}
          layout="vertical"
          className="pt-2"
          onFinish={onPasswordSubmit}
          autoComplete="off"
        >
          <Form.Item<ChangePasswordForm>
            name="password"
            label={
              <Typography.Text
                className="tracking-tight leading-4 text-sm"
                type="secondary"
              >
                Enter your current password
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: 'Please enter your old password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Current password" />
          </Form.Item>
          <Form.Item<ChangePasswordForm>
            name="newPass"
            label={
              <Typography.Text
                className="tracking-tight leading-4 text-sm"
                type="secondary"
              >
                Enter new password
              </Typography.Text>
            }
            rules={[
              {
                required: true,
                message: 'Please enter a password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="New password" />
          </Form.Item>
          <Form.Item<ChangePasswordForm>
            name="confirm"
            label={
              <Typography.Text
                className="tracking-tight leading-4 text-sm"
                type="secondary"
              >
                Confirm your new password
              </Typography.Text>
            }
            dependencies={['newPass']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPass') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The new password that you entered do not match!',
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>
          <Form.Item>
            <Button block loading={loading} type="primary" htmlType="submit">
              Change password
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}
