import { UserTransferData } from 'src/transfer';
import { ChangeRoleDto } from 'src/user/dto/change-role.dto';
import { DeepPartial, UserRoles } from './core.interface';

export interface IUserService {
  changeRole(dto: ChangeRoleDto): Promise<UserTransferData>;
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateUserOptions extends DeepPartial<ICreateUserOptions> {}
