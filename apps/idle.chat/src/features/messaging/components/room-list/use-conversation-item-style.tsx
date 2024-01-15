import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { createStyles } from 'antd-style';

const { useToken } = theme;
export default function useConversationItemStyle() {
  const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);
  const listPrefixCls = getPrefixCls('list');
  const { token } = useToken();

  return createStyles(({ css }) => ({
    list: css`
      .${listPrefixCls}-item {
        &:hover {
          cursor: pointer;
          background-color: ${token.controlItemBgHover};
        }
      }
    `,
    listActive: css`
      .active {
        background-color: ${token.colorBgTextHover};

        &:hover {
          cursor: pointer;
          background-color: ${token.colorBgTextHover};
        }
      }
    `,
  }))();
}
