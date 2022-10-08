import { Types } from 'mongoose';
import { FileDocument } from 'src/file/schemas/file.schema';
import { AccessTypes, ItemTypes } from './core';

export type CreateFileOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  file: Express.Multer.File;
  fileSize: number;
};

export type UpdateFileOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  file?: Express.Multer.File;
  fileSize?: number;
};

export class FileTransferData {
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
  readonly file: string;
  readonly fileSize: number;

  constructor(fileDocument: FileDocument) {
    this.id = fileDocument._id;
    this.type = fileDocument.type;
    this.parent = fileDocument.parent;
    this.name = fileDocument.name;
    this.isTrash = fileDocument.isTrash;
    this.likeCount = fileDocument.likeCount;
    this.likedUsers = fileDocument.likedUsers;
    this.listenCount = fileDocument.listenCount;
    this.starredCount = fileDocument.starredCount;
    this.accesLink = fileDocument.accessLink;
    this.accessType = fileDocument.accessType;
    this.creationDate = fileDocument.creationDate;
    this.openDate = fileDocument.openDate;
    this.file = fileDocument.file;
    this.fileSize = fileDocument.fileSize;
  }
}
