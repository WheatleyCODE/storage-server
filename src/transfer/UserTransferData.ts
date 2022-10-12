import { UserDocument } from 'src/user/schemas/user.schema';

export class UserTransferData {
  constructor(
    user: UserDocument,
    readonly id = user._id,
    readonly name = user.name,
    readonly email = user.email,
    readonly isActivated = user.isActivated,
    readonly roles = user.role,
  ) {}
}
