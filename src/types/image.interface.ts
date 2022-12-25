import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from './core.interface';

export interface IImageService<T> {
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
}

export type CreateImageOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  image: Express.Multer.File;
  imageSize: number;
};

export type UpdateImageOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  image?: Express.Multer.File;
  imageSize?: number;
};
