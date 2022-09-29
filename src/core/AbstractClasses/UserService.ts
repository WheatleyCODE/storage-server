import { Types } from 'mongoose';
import { UserRoles } from 'src/types';
import { DefaultService } from './DefaultService';

export abstract class UserService<T, O> extends DefaultService<T, O> {
  abstract changeRole(id: Types.ObjectId, role: UserRoles): Promise<T>;
  abstract changePassword(id: Types.ObjectId, password: string): Promise<T>;
  abstract changeActivated(id: Types.ObjectId, value: boolean): Promise<T>;
  abstract createActivationLink(id: Types.ObjectId): Promise<T>;
  abstract deleteActivationLink(id: Types.ObjectId): Promise<T>;
  abstract createResetPasswordLink(id: Types.ObjectId): Promise<T>;
  abstract deleteResetPasswordLink(id: Types.ObjectId): Promise<T>;
}
