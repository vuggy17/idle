import { Models } from 'appwrite';

export type RegisterUserResponseDTO = Models.User<Models.Preferences>;
export type RegisterUserRequestDTO = {
  email: string;
  password: string;
  name: string;
};

export type LoginUserResponseDTO = Models.Session;
export type LoginUserRequestDTO = {
  email: string;
  password: string;
};

export type UserDTO = Promise<Models.User<Models.Preferences>>;
