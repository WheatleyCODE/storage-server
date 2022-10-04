import { Types } from 'mongoose';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { AccessTypes, FolderColors, ItemTypes } from './core';

export type CreateFolderOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  color?: FolderColors;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
};

export type UpdateFolderOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  color?: FolderColors;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
};

export class FolderTransferData {
  readonly id: Types.ObjectId;
  readonly type: ItemTypes;
  readonly parent: Types.ObjectId;
  readonly color: FolderColors;
  readonly name: string;
  readonly isTrash: boolean;
  readonly likeCount: number;
  readonly likedUsers: Types.ObjectId[];
  readonly listenCount: number;
  readonly listenedUsers: Types.ObjectId[];
  readonly starredCount: number;
  readonly starredUser: Types.ObjectId[];
  readonly accesLink: string;
  readonly accessType: AccessTypes;
  readonly creationDate: number;
  readonly openDate: number;

  constructor(folderDocument: FolderDocument) {
    this.id = folderDocument._id;
    this.type = folderDocument.type;
    this.parent = folderDocument.parent;
    this.color = folderDocument.color;
    this.name = folderDocument.name;
    this.isTrash = folderDocument.isTrash;
    this.likeCount = folderDocument.likeCount;
    this.likedUsers = folderDocument.likedUsers;
    this.listenCount = folderDocument.listenCount;
    this.listenedUsers = folderDocument.listenedUsers;
    this.starredCount = folderDocument.starredCount;
    this.accesLink = folderDocument.accesLink;
    this.accessType = folderDocument.accessType;
    this.creationDate = folderDocument.creationDate;
    this.openDate = folderDocument.openDate;
  }
}
