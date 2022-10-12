import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from './core';

export type CreateTrackOptions = {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  author: string;
  text: string;
  image?: Express.Multer.File;
  imageSize?: number;
  audio: Express.Multer.File;
  audioSize: number;
};

export type UpdateTrackOptions = {
  type?: ItemTypes;
  user?: Types.ObjectId;
  name?: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accesLink?: string;
  accessType?: AccessTypes;
  creationDate?: number;
  openDate?: number;
  author?: string;
  text?: string;
  image?: Express.Multer.File;
  imageSize?: number;
  audio?: Express.Multer.File;
  audioSize?: number;
};
