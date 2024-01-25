import React, { useEffect, useRef, useState } from 'react';
import { Select, Spin } from 'antd';
import type { SelectProps } from 'antd/es/select';
import { Options as DebounceOptions, useDebouncedCallback } from 'use-debounce';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
  config?: DebounceOptions;
  prefetch?: boolean;
}

/**
 * @function DebounceSelect
 * @description A debounced select component for fetching options asynchronously.
 * @param {DebounceSelectProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 * @example
 * // Example usage of DebounceSelect
 * const fetchOptions = async (search) => {
 *   // Your implementation to fetch options based on the search value
 * };
 *
 * function MyComponent() {
 *   return (
 *     <DebounceSelect
 *       fetchOptions={fetchOptions}
 *       debounceTimeout={500}
 *       prefetch={true}
 *       config={{ maxWait: 1000 }}
 *     />
 *   );
 * }
 */
export function DebounceSelect<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  prefetch = false,
  config = {},
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const fetchWithSequenceControl = (value: string) => {
    fetchRef.current += 1;
    const fetchId = fetchRef.current;
    setOptions([]);
    setFetching(true);

    fetchOptions(value).then((newOptions) => {
      if (fetchId !== fetchRef.current) {
        // for fetch callback order
        return;
      }

      setOptions(newOptions);
      setFetching(false);
    });
  };

  const debounceFetcher = useDebouncedCallback(
    fetchWithSequenceControl,
    debounceTimeout,
    config,
  );

  useEffect(() => {
    if (prefetch) {
      fetchWithSequenceControl('');
    }
  }, [prefetch, fetchOptions]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}
