import { Types } from 'mongoose';
import { FileDocument } from 'src/file/schemas/file.schema';

export class FileTransferData {
  constructor(
    filedoc: FileDocument,
    readonly id: Types.ObjectId = filedoc._id,
    readonly user = filedoc.user,
    readonly type = filedoc.type,
    readonly name = filedoc.name,
    readonly parent = filedoc.parent,
    readonly isTrash = filedoc.isTrash,
    readonly likeCount = filedoc.likeCount,
    readonly likedUsers = filedoc.likedUsers,
    readonly listenCount = filedoc.listenCount,
    readonly starredCount = filedoc.starredCount,
    readonly accessType = filedoc.accessType,
    readonly accesLink = filedoc.accessLink,
    readonly creationDate = filedoc.creationDate,
    readonly openDate = filedoc.openDate,
    readonly comments = filedoc.comments,
    readonly file = filedoc.file,
    readonly fileSize = filedoc.fileSize,
  ) {}
}
