import { Types } from 'mongoose';
import { UserTransferData } from 'src/transfer';
import { UserRoles } from 'src/types';
import { IDefaultService } from '../AbstractClasses/IDefaultService';

export abstract class IUserService<T, O> extends IDefaultService<T, O> {
  abstract changeRole(id: Types.ObjectId, role: UserRoles[]): Promise<UserTransferData>;
}
