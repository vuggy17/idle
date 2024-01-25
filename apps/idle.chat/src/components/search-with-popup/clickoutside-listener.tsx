import React, {
  forwardRef,
  PropsWithChildren,
  MutableRefObject,
  useCallback,
} from 'react';
import useClickOutsideListener from '../../hooks/use-click-outside-listener';

interface Props extends PropsWithChildren {
  onClick: () => void;
}
export type Ref = HTMLDivElement | null;

export const ClickOutsideListener = forwardRef<Ref, Props>(
  ({ children, onClick }, forwardedRef) => {
    const ref =
      (forwardedRef as MutableRefObject<HTMLDivElement | null>) ||
      React.createRef<HTMLDivElement>();

    useClickOutsideListener(
      ref,
      useCallback(() => {
        onClick();
      }, [onClick]),
    );

    return <div ref={ref}>{children}</div>;
  },
);
