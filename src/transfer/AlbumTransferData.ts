import { Types } from 'mongoose';
import { AlbumDocument } from 'src/album/schemas/album.schema';
import { AccessTypes, ItemTypes } from 'src/types';

export class AlbumTransferData {
  readonly id: Types.ObjectId;
  readonly type: ItemTypes;
  readonly parent: Types.ObjectId;
  readonly name: string;
  readonly isTrash: boolean;
  readonly likeCount: number;
  readonly likedUsers: Types.ObjectId[];
  readonly listenCount: number;
  readonly starredCount: number;
  readonly accesLink: string;
  readonly accessType: AccessTypes;
  readonly creationDate: number;
  readonly openDate: number;
  readonly image: string;
  readonly imageSize: number;
  readonly tracks: Types.ObjectId[];

  constructor(albumDocument: AlbumDocument) {
    this.id = albumDocument._id;
    this.type = albumDocument.type;
    this.parent = albumDocument.parent;
    this.name = albumDocument.name;
    this.isTrash = albumDocument.isTrash;
    this.likeCount = albumDocument.likeCount;
    this.likedUsers = albumDocument.likedUsers;
    this.listenCount = albumDocument.listenCount;
    this.starredCount = albumDocument.starredCount;
    this.accesLink = albumDocument.accessLink;
    this.accessType = albumDocument.accessType;
    this.creationDate = albumDocument.creationDate;
    this.openDate = albumDocument.openDate;
    this.image = albumDocument.image;
    this.imageSize = albumDocument.imageSize;
    this.tracks = albumDocument.tracks;
  }
}
