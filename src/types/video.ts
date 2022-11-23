import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from './core';

export type CreateVideoOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  description: string;
  image?: Express.Multer.File;
  imageSize?: number;
  video: Express.Multer.File;
  videoSize: number;
};

export type UpdateVideoOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  description?: string;
  image?: Express.Multer.File;
  imageSize?: number;
  video?: Express.Multer.File;
  videoSize?: number;
};
