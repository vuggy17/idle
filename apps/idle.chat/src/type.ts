/**
 * UseCase interface for defining a use case.
 * @template Input - The type of the input to the use case.
 * @template Output - The type of the output from the use case.
 */
export interface UseCase<Input, Output> {
  /**
   * Executes the use case with the given input.
   * @param useCaseInput - The input to the use case.
   * @returns A promise that resolves to the output of the use case.
   */
  execute(useCaseInput: Input): PromiseLike<Output>;
}

export type WithAbortSignal<T> = T & { abortSignal: AbortSignal };

/**
 * Creates a new type from an existing type T by making some of its properties K optional.
 * @template T The original type.
 * @template K The keys of the properties to make optional.
 * @typedef {Omit<T, K> & Partial<Pick<T, K>>} PartialBy
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
