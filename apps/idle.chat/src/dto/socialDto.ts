export type FindUserByNameRequestDTO = {
  q: string;
  abortSignal: AbortSignal;
};
export type FindUserByNameResponseDTO = FindUserSingleResponseDTO[];

export type FindUserSingleResponseDTO = {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  isFriend: boolean;
};
