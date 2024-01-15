import { Flex, FlexProps, Spin } from 'antd';

export default function ModalFallback({
  style,
  ...props
}: Omit<FlexProps, 'children'>) {
  return (
    <Flex
      {...props}
      justify="center"
      align="center"
      style={{
        height: ' 100%',
        width: '100%',
        ...style,
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <Spin />
    </Flex>
  );
}
