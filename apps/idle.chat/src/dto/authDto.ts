import { Models } from 'appwrite';

export type UserDTO = Models.User<Models.Preferences> & { avatar?: string };

export type RegisterUserResponseDTO = UserDTO;
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

export type ChangePasswordResponseDTO = UserDTO;
export type ChangePasswordRequestDTO = { currentPass: string; newPass: string };

export type DeactivateAccountResponseDTO = UserDTO;
export type DeactivateAccountRequestDTO = { email: string; password: string };
