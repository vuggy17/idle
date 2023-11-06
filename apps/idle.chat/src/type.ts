export interface UseCase<Input, Output> {
  execute(useCaseInput: Input): PromiseLike<Output>;
}
