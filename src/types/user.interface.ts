import { Types } from 'mongoose';
import { UserTransferData } from 'src/transfer';
import { ChangeRoleDto } from 'src/user/dto/change-role.dto';
import { DeepPartial } from './core.interface';

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export interface IUserService {
  changeRole(dto: ChangeRoleDto): Promise<UserTransferData>;
  deleteUserAndStorage(id: Types.ObjectId): Promise<UserTransferData>;
}

export interface ICreateUserOptions {
  name: string;
  role?: UserRoles[];
  email: string;
  password: string;
  isActivated?: boolean;
  activationLink?: string;
  resetPasswordLink?: string;
}

export interface IUpdateUserOptions extends DeepPartial<ICreateUserOptions> {}
