import {
  Button,
  ConfigProvider,
  Form,
  Input,
  Modal,
  ModalProps,
  Space,
  Typography,
} from 'antd';
import { useAtomValue } from 'jotai';
import { useEffect, useLayoutEffect, useState } from 'react';
import { currentUserAtom } from 'store/user';

type DeleteAccountModalProps = ModalProps;
type DeleteAccountForm = {
  email: string;
  password: string;
  confirmPhrase: string;
};
const CONFIRM_DELETE_PHRASE = 'delete my account';

const { useForm } = Form;

export default function DeleteAccountModal({
  ...modalProps
}: DeleteAccountModalProps) {
  const { email } = useAtomValue(currentUserAtom);
  const [form] = useForm();
  const { onOk, width, footer, centered } = modalProps;
  const [clientReady, setClientReady] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // To disable submit button at the beginning.
  // Prevent button to flickering
  useLayoutEffect(() => {
    setClientReady(true);
  }, []);

  const onDeleteAccountConfirmed = (data: DeleteAccountForm) => {
    try {
      // last check
      if (data.confirmPhrase !== CONFIRM_DELETE_PHRASE) {
        form.setFields([
          {
            name: 'confirmPhrase',
            errors: ['Wrong confirm phrase'],
          },
        ]);
      }
      // login
      // delete account
      // close modal if everything ok
      onOk?.({} as any);
    } catch (error) {
      // handle error
      // wrong password
      // wrong email
      // etc..
    }
  };

  return (
    <Modal
      {...modalProps}
      width={width ?? 420}
      footer={footer ?? null}
      centered={centered || true}
    >
      <Space direction="vertical" size="large">
        <Typography.Text className="text-base">
          This action cannot be undone. This will permanently delete your entire
          account. You cannot access your messages, shared files anymore.
        </Typography.Text>
        <Typography.Text className="text-base">
          Please type in your email to confirm
        </Typography.Text>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 16,
              },
            },
          }}
        >
          <Form
            layout="vertical"
            form={form}
            autoComplete="off"
            onFinish={onDeleteAccountConfirmed}
          >
            <Form.Item<DeleteAccountForm>
              name="email"
              label={
                <Typography.Text className="font-medium">
                  Your email
                </Typography.Text>
              }
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please type in correct email',
                },
                () => ({
                  validator(_, value) {
                    if (!value || value === email) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('Please type in correct email')
                      );
                    }
                  },
                }),
              ]}
            >
              <Input placeholder={email} />
            </Form.Item>
            <Form.Item
              name="confirmPhrase"
              hasFeedback
              label={
                <>
                  <Typography.Text className="font-medium">
                    To verify, type
                  </Typography.Text>{' '}
                  <Typography.Text italic>
                    &nbsp;delete my account&nbsp;
                  </Typography.Text>
                  <Typography.Text className="font-medium">
                    below
                  </Typography.Text>
                </>
              }
              rules={[
                {
                  required: true,
                  message: `Please type in "${CONFIRM_DELETE_PHRASE}"`,
                },
                () => ({
                  validator(_, value) {
                    if (!value || value == CONFIRM_DELETE_PHRASE) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error('Please type in correct phrase')
                      );
                    }
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<DeleteAccountForm>
              required
              className="font-medium"
              label="Confirm your password"
            >
              <Input.Password />
            </Form.Item>

            <Form.Item shouldUpdate>
              {() => (
                <Button
                  loading={isDeleting}
                  block
                  danger
                  type="primary"
                  htmlType="submit"
                  disabled={
                    !clientReady ||
                    !form.isFieldsTouched(true) ||
                    !!form
                      .getFieldsError()
                      .filter(({ errors }) => errors.length).length
                  }
                >
                  Permanently delete this account
                </Button>
              )}
            </Form.Item>
          </Form>
        </ConfigProvider>
        <Button
          loading={isDeleting}
          block
          type="default"
          onClick={(e) =>
            modalProps.onCancel?.(
              e as React.MouseEvent<HTMLButtonElement, MouseEvent>
            )
          }
        >
          Cancel
        </Button>
      </Space>
    </Modal>
  );
}
