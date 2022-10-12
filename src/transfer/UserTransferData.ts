import { Types } from 'mongoose';
import { UserRoles } from 'src/types';
import { UserDocument } from 'src/user/schemas/user.schema';

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
