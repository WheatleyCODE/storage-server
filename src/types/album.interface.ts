import { Types } from 'mongoose';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
import { ChangeTracksDto } from 'src/album/dto/change-tracks.dto';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { AlbumTransferData } from 'src/transfer';
import { AccessTypes, DeepPartial, ItemTypes } from './core.interface';

export interface IAlbumService {
  changeImage(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<AlbumTransferData>;
  changeTracks(dto: ChangeTracksDto, user: Types.ObjectId): Promise<AlbumTransferData>;
  createAlbum(
    dto: CreateAlbumDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<AlbumTransferData>;
}

export interface ICreateAlbumOptions {
  type?: ItemTypes;
  user: Types.ObjectId;
  name: string;
  author: string;
  parent?: Types.ObjectId;
  accessLink?: string;
  accessType?: AccessTypes;
  creationDate: number;
  openDate: number;
  image: Express.Multer.File;
  imageSize: number;
  tracks?: Types.ObjectId[];
}

export interface IUpdateAlbumOptions extends DeepPartial<ICreateAlbumOptions> {}
