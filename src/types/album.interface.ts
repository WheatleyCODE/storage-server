import { Types } from 'mongoose';
import { ChangeTracksDto } from 'src/album/dto/change-tracks.dto';
import { AlbumTransferData } from 'src/transfer';
import { AccessTypes, ItemTypes } from './core.interface';

export interface IAlbumService<T> {
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<T>;
  changeTracks(dto: ChangeTracksDto): Promise<AlbumTransferData>;
}

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
