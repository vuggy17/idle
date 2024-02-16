import { Array as YArray, Map as YMap } from 'yjs';

export type Native2Y<T> = T extends Record<string, infer U>
  ? YMap<U>
  : T extends Array<infer U>
    ? YArray<U>
    : T;

export function isPureObject(value: unknown): value is object {
  return (
    value !== null &&
    typeof value === 'object' &&
    Object.prototype.toString.call(value) === '[object Object]' &&
    [Object, undefined, null].some((x) => x === value.constructor)
  );
}

type TransformOptions = {
  deep?: boolean;
  transform?: (value: unknown, origin: unknown) => unknown;
};

export function native2Y<T>(
  value: T,
  { deep = true, transform = (x) => x }: TransformOptions = {},
): Native2Y<T> {
  if (Array.isArray(value)) {
    const yArray: YArray<unknown> = new YArray<unknown>();
    const result = value.map((item) => {
      return deep ? native2Y(item, { deep, transform }) : item;
    });
    yArray.insert(0, result);

    return yArray as Native2Y<T>;
  }
  if (isPureObject(value)) {
    const yMap = new YMap<unknown>();
    Object.entries(value).forEach(([key, v]) => {
      yMap.set(key, deep ? native2Y(v, { deep, transform }) : v);
    });

    return yMap as Native2Y<T>;
  }

  return value as Native2Y<T>;
}
