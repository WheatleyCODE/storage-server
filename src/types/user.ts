import { UserRoles } from './core';

export type CreateUserOptions = {
  name: string;
  role?: UserRoles[];
  email: string;
  password: string;
  isActivated?: boolean;
  activationLink?: string;
  resetPasswordLink?: string;
};

export type UpdateUserOptions = {
  name?: string;
  role?: UserRoles[];
  email?: string;
  password?: string;
  isActivated?: boolean;
  activationLink?: string;
  resetPasswordLink?: string;
};
