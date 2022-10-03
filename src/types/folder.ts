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
  creationDate?: number;
  openDate?: number;
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

  constructor(folderDocument: FolderDocument) {
    this.id = folderDocument._id;
  }
}
