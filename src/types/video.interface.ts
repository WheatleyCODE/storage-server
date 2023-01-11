import { Types } from 'mongoose';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';
import { VideoTransferData } from 'src/transfer';

// ! Разделить интерфейсы на классы по changeFiles, getAllPublicVideos
export interface IVideoService<T> {
  changeFiles(
    id: Types.ObjectId,
    video?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<T>;
  getAllPublicVideos(count: number, offset: number): Promise<VideoTransferData[]>;
  searchPublicVideos(text: string, count: number, offset: number): Promise<VideoTransferData[]>;
}

export interface ICreateVideoOptions {
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
}

export interface IUpdateVideoOptions extends DeepPartial<ICreateVideoOptions> {}
