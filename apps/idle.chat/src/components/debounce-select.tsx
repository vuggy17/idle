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

  console.log('options', options);
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
