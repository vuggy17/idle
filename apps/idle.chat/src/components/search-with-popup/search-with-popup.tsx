import {
  Divider,
  Dropdown,
  DropdownProps,
  Input,
  MenuProps,
  Space,
  Spin,
  Typography,
  theme,
} from 'antd';
import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';
import useClickOutsideListener from '../../hooks/use-click-outside-listener';

export type SearchWithPopupProps = {
  value?: string;
  options: MenuProps['items'];
  open?: boolean;
  defaultOpen?: boolean;
  loading?: boolean;
  onChange?: (text: string) => void;
  onClick?: (e: Event) => void;
  onSearch?: (text: string) => void;
  dropdownProps?: DropdownProps;
  onItemClick?: MenuProps['onClick'];
  autoFocusInput?: boolean;
};

const { useToken } = theme;

export default function SearchWithPopup({
  value = '',
  autoFocusInput = false,
  defaultOpen,
  loading,
  onClick,
  onChange,
  dropdownProps,
  options,
  onSearch,
  onItemClick,
  ...props
}: SearchWithPopupProps) {
  const { token } = useToken();

  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(props.open);
  const popupContainerRef = useRef<HTMLDivElement>(null);

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    cursor: 'pointer',
  };

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // hide suggestion popup conditions derived from component state
  const hasAnySearchSuggestions = options ? options.length > 0 : false;
  const didUserTyped = !!query;

  // reference to suggestion popup
  useClickOutsideListener(
    popupContainerRef,
    useCallback(() => {
      setOpen(false);
    }, []),
  );

  return (
    <div ref={popupContainerRef}>
      <Dropdown
        open={open}
        getPopupContainer={() => popupContainerRef.current as HTMLDivElement}
        trigger={[]}
        placement="bottom"
        arrow={false}
        menu={{
          style: {
            maxHeight: 320,
            overflow: 'auto',
          },
          items: options,
          onClick: (info) => {
            onItemClick?.(info);
            setOpen(false);
          },
        }}
        // eslint-disable-next-line react/no-unstable-nested-components
        dropdownRender={(menu) => (
          <div style={contentStyle} data-testid="search-popup">
            <Space
              className="w-full justify-between hover:font-semibold"
              onClick={() => {
                onSearch?.(query);
                setOpen(false);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query) {
                  onSearch?.(query);
                  setOpen(false);
                }
              }}
            >
              <Space style={{ padding: 8 }}>
                <Typography.Text strong>Search: </Typography.Text>
                <Typography.Text data-testid="find-people-search-phrase">
                  {query}
                </Typography.Text>
              </Space>
              {loading ? <Spin size="small" className="mr-4" /> : null}
            </Space>
            <Divider style={{ margin: 0 }} />
            {cloneElement(menu as React.ReactElement)}
          </div>
        )}
        {...dropdownProps}
      >
        <Input
          autoFocus={autoFocusInput}
          data-testid="search-people-input"
          onKeyDown={(e) => {
            // open popup when user is typing
            if (!open) setOpen(true);
            if (e.key === 'Enter') {
              onSearch?.(query);
              setOpen(false);
            }
          }}
          spellCheck={false}
          onFocus={() => {
            setOpen(didUserTyped || hasAnySearchSuggestions);
          }}
          onClick={() => {
            if (query) setOpen(true);
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange?.(e.target.value);
          }}
          size="large"
          placeholder="Search for people"
        />
      </Dropdown>
    </div>
  );
}
