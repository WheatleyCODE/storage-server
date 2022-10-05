import { Types } from 'mongoose';
import { UserRoles, UserTransferData } from 'src/types';
import { IDefaultService } from '../AbstractClasses/IDefaultService';

export abstract class IUserService<T, O> extends IDefaultService<T, O> {
  abstract changeRole(id: Types.ObjectId, role: UserRoles[]): Promise<UserTransferData>;
}
