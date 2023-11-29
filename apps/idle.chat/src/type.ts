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
