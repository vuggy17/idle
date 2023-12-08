import { ID, TIME } from './common';

export type GetUserSearchSuggestionRequestDTO = {
  q: string;
};
export type GetUserSearchSuggestionResponseDTO = {
  id: ID;
  name: string;
  avatar: string;
  phone: string;
  createdAt: TIME;
  updatedAt: TIME;
}[];

export type GetUserSearchResultRequestDTO = {
  q: string;
};
export type GetUserSearchResultResponseDTO = {
  id: ID;
  name: string;
  avatar: string;
  bio: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
}[];
