import { Types } from 'mongoose';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { AccessTypes, ItemTypes } from './core';

export type CreateTrackOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  author: string;
  text: string;
  image: Express.Multer.File;
  audio: Express.Multer.File;
};

export type UpdateTrackOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  author?: string;
  text?: string;
  image?: Express.Multer.File;
  audio?: Express.Multer.File;
};

export class TrackTransferData {
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
  readonly author: string;
  readonly text: string;
  readonly image: string;
  readonly audio: string;

  constructor(trackDocument: TrackDocument) {
    this.id = trackDocument._id;
    this.type = trackDocument.type;
    this.parent = trackDocument.parent;
    this.name = trackDocument.name;
    this.isTrash = trackDocument.isTrash;
    this.likeCount = trackDocument.likeCount;
    this.likedUsers = trackDocument.likedUsers;
    this.listenCount = trackDocument.listenCount;
    this.starredCount = trackDocument.starredCount;
    this.accesLink = trackDocument.accessLink;
    this.accessType = trackDocument.accessType;
    this.creationDate = trackDocument.creationDate;
    this.openDate = trackDocument.openDate;
    this.author = trackDocument.author;
    this.text = trackDocument.text;
    this.image = trackDocument.image;
    this.audio = trackDocument.audio;
  }
}
