import { Types } from 'mongoose';
import { UserRoles } from './core.interface';
import { UserTransferData } from 'src/transfer';

export interface IUserService {
  changeRole(id: Types.ObjectId, role: UserRoles[]): Promise<UserTransferData>;
}

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
