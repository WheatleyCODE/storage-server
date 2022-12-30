import { Types } from 'mongoose';
import { AlbumDocument } from 'src/album/schemas/album.schema';

// ! fix this dup
export class AlbumTransferData {
  constructor(
    album: AlbumDocument,
    readonly id: Types.ObjectId = album._id,
    readonly user = album.user,
    readonly type = album.type,
    readonly name = album.name,
    readonly parent = album.parent,
    readonly isTrash = album.isTrash,
    readonly likeCount = album.likeCount,
    readonly likedUsers = album.likedUsers,
    readonly listenCount = album.listenCount,
    readonly starredCount = album.starredCount,
    readonly accessType = album.accessType,
    readonly accesLink = album.accessLink,
    readonly creationDate = album.createDate,
    readonly openDate = album.openDate,
    readonly comments = album.comments,
    readonly image = album.image,
    readonly imageSize = album.imageSize,
    readonly tracks = album.tracks,
  ) {}
}
