export type FindUserByNameRequestDTO = {
  q: string;
  abortSignal: AbortSignal;
};
export type FindUserByNameResponseDTO = FindUserSingleResponseDTO[];

export type FindUserSingleResponseDTO = {
  id: string;
  name: string;
  bio: string;
  isFriend: boolean;
  avatar?: string;
  hasPendingRequest?: boolean;
};
