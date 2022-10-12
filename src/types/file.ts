import { Types } from 'mongoose';
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
