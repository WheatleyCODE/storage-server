import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from './core';

export type CreateAlbumOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  author: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  image: Express.Multer.File;
  imageSize: number;
  tracks?: Types.ObjectId[];
};

export type UpdateAlbumOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  author?: string;
  parent?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  image?: Express.Multer.File;
  imageSize?: number;
  tracks?: Types.ObjectId[];
};
