import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from './core.interface';

export interface IFileService<T> {
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
}

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

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
}