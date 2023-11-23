export type Modify<T, R> = Omit<T, keyof R> & R;
export type ValueOf<T> = T[keyof T];
