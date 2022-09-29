import { Types } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';
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

export class UserTransferData {
  readonly id: Types.ObjectId;
  readonly name: string;
  readonly email: string;
  readonly isActivated: boolean;
  readonly roles: UserRoles[];

  constructor(userDocument: UserDocument) {
    this.email = userDocument.email;
    this.id = userDocument._id;
    this.isActivated = userDocument.isActivated;
    this.roles = userDocument.role;
    this.name = userDocument.name;
  }
}
