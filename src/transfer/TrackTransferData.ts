import { Types } from 'mongoose';
import { TrackDocument } from 'src/track/schemas/track.schema';

export class TrackTransferData {
  constructor(
    track: TrackDocument,
    readonly id: Types.ObjectId = track._id,
    readonly user = track.user,
    readonly type = track.type,
    readonly name = track.name,
    readonly parent = track.parent,
    readonly isTrash = track.isTrash,
    readonly likeCount = track.likeCount,
    readonly likedUsers = track.likedUsers,
    readonly listenCount = track.listenCount,
    readonly starredCount = track.starredCount,
    readonly accessType = track.accessType,
    readonly accesLink = track.accessLink,
    readonly creationDate = track.creationDate,
    readonly openDate = track.openDate,
    readonly comments = track.comments,
    readonly author = track.author,
    readonly text = track.text,
    readonly image = track.image,
    readonly imageSize = track.imageSize,
    readonly audio = track.audio,
    readonly audioSize = track.audioSize,
  ) {}
}
