import { Types } from 'mongoose';
import { FolderService } from 'src/folder/folder.service';
import { FolderDocument } from 'src/folder/schemas/folder.schema';

export type Pagination = { count: number; offset: number };

export enum AccessTypes {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  LINK = 'LINK',
}

export enum ItemTypes {
  FOLDER = 'FOLDER',
}

export enum FolderColors {
  GREY = 'GREY',
  RED = 'RED',
  BLUE = 'BLUE',
}

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export type ObjectServices = {
  [ItemTypes.FOLDER]: FolderService;
};

export type StorageCollectionNames = 'folders';

export type DeleteItems = {
  deleteCount: number;
  deleteItems: Types.ObjectId[];
};

export type ItemDocument = FolderDocument;
