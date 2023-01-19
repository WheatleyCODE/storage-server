import { Types } from 'mongoose';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';
import { TrackTransferData } from 'src/transfer';
import { CreateTrackDto } from 'src/track/dto/create-track-dto';
import { ChangeTrackFilesDto } from 'src/storage/dto/change-track-files.dto';

export interface ITrackService<T> {
  createTrack(
    dto: CreateTrackDto,
    user: Types.ObjectId,
    audio: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData>;
  changeFiles(
    id: Types.ObjectId,
    audio?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<T>;
  changeTrackFiles(
    dto: ChangeTrackFilesDto,
    audio?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData>;
}

export interface ICreateTrackOptions {
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
  text?: string;
  image?: Express.Multer.File;
  imageSize?: number;
  audio: Express.Multer.File;
  audioSize: number;
}

export interface IUpdateTrackOptions extends DeepPartial<ICreateTrackOptions> {}
