import { Types } from 'mongoose';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';

export interface IFileService<T> {
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
}

export interface ICreateFileOptions {
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
}

export interface IUpdateFileOptions extends DeepPartial<ICreateFileOptions> {}

export enum FileType {
  AUDIO = 'audio',
  IMAGE = 'image',
  FILE = 'file',
  VIDEO = 'video',
}
