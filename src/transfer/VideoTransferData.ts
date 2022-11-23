import { Types } from 'mongoose';
import { VideoDocument } from 'src/video/schemas/video.schema';

export class VideoTransferData {
  constructor(
    videoDoc: VideoDocument,
    readonly id: Types.ObjectId = videoDoc._id,
    readonly user = videoDoc.user,
    readonly type = videoDoc.type,
    readonly name = videoDoc.name,
    readonly parent = videoDoc.parent,
    readonly isTrash = videoDoc.isTrash,
    readonly likeCount = videoDoc.likeCount,
    readonly likedUsers = videoDoc.likedUsers,
    readonly listenCount = videoDoc.listenCount,
    readonly starredCount = videoDoc.starredCount,
    readonly accessType = videoDoc.accessType,
    readonly accesLink = videoDoc.accessLink,
    readonly creationDate = videoDoc.creationDate,
    readonly openDate = videoDoc.openDate,
    readonly comments = videoDoc.comments,
    readonly description = videoDoc.description,
    readonly image = videoDoc.image,
    readonly imageSize = videoDoc.imageSize,
    readonly video = videoDoc.video,
    readonly videoSize = videoDoc.videoSize,
  ) {}
}
