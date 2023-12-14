import { Models } from 'appwrite';
import { ID, TIME } from './common';

export type UserDTO = {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  createdAt: TIME;
  updatedAt: TIME;
};

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

export type ChangePasswordResponseDTO = Models.User<Models.Preferences>;
export type ChangePasswordRequestDTO = { currentPass: string; newPass: string };

export type DeactivateAccountResponseDTO = Models.User<Models.Preferences>;
export type DeactivateAccountRequestDTO = { id: ID };
