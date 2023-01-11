import { Types } from 'mongoose';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';

export interface IImageService<T> {
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
}

export interface ICreateImageOptions {
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
}

export interface IUpdateImageOptions extends DeepPartial<ICreateImageOptions> {}
