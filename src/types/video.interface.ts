import { Types } from 'mongoose';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';
import { VideoTransferData } from 'src/transfer';
import { CreateVideoDto } from 'src/video/dto/create-video.dto';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
export interface IVideoService<T> {
  createVideo(
    dto: CreateVideoDto,
    user: Types.ObjectId,
    video: Express.Multer.File,
    image: Express.Multer.File,
  ): Promise<VideoTransferData>;
  changeFile(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    audio: Express.Multer.File,
  ): Promise<VideoTransferData>;
  changeImage(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<VideoTransferData>;
}

export interface ICreateVideoOptions {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  parent?: Types.ObjectId;
  album?: Types.ObjectId;
  accessLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  description?: string;
  image?: Express.Multer.File;
  imageSize?: number;
  video: Express.Multer.File;
  videoSize: number;
}

export interface IUpdateVideoOptions extends DeepPartial<ICreateVideoOptions> {}
