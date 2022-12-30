import { Types } from 'mongoose';
import { ImageDocument } from 'src/image/schemas/image.schema';

export class ImageTransferData {
  constructor(
    imageDoc: ImageDocument,
    readonly id: Types.ObjectId = imageDoc._id,
    readonly user = imageDoc.user,
    readonly type = imageDoc.type,
    readonly name = imageDoc.name,
    readonly parent = imageDoc.parent,
    readonly isTrash = imageDoc.isTrash,
    readonly likeCount = imageDoc.likeCount,
    readonly likedUsers = imageDoc.likedUsers,
    readonly listenCount = imageDoc.listenCount,
    readonly starredCount = imageDoc.starredCount,
    readonly accessType = imageDoc.accessType,
    readonly accesLink = imageDoc.accessLink,
    readonly creationDate = imageDoc.createDate,
    readonly openDate = imageDoc.openDate,
    readonly comments = imageDoc.comments,
    readonly image = imageDoc.image,
    readonly imageSize = imageDoc.imageSize,
  ) {}
}
