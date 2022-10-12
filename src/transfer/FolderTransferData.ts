import { Types } from 'mongoose';
import { FolderDocument } from 'src/folder/schemas/folder.schema';

export class FolderTransferData {
  constructor(
    folder: FolderDocument,
    readonly id: Types.ObjectId = folder._id,
    readonly user = folder.user,
    readonly type = folder.type,
    readonly name = folder.name,
    readonly parent = folder.parent,
    readonly isTrash = folder.isTrash,
    readonly likeCount = folder.likeCount,
    readonly likedUsers = folder.likedUsers,
    readonly listenCount = folder.listenCount,
    readonly starredCount = folder.starredCount,
    readonly accessType = folder.accessType,
    readonly accesLink = folder.accessLink,
    readonly creationDate = folder.creationDate,
    readonly openDate = folder.openDate,
    readonly comments = folder.comments,
    readonly color = folder.color,
  ) {}
}
