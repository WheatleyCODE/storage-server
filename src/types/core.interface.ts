import { Types } from 'mongoose';
import { Request, Response } from 'express';
import { AlbumService } from 'src/album/album.service';
import { AlbumDocument } from 'src/album/schemas/album.schema';
import { FileService } from 'src/file/file.service';
import { FileDocument } from 'src/file/schemas/file.schema';
import { FolderService } from 'src/folder/folder.service';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { TrackService } from 'src/track/track.service';
import { ImageDocument } from 'src/image/schemas/image.schema';
import { ImageService } from 'src/image/image.service';
import { ImageTransferData } from 'src/transfer/image.transfer-data';
import { VideoService } from 'src/video/video.service';
import { VideoDocument } from 'src/video/schemas/video.schema';
import {
  FolderTransferData,
  TrackTransferData,
  FileTransferData,
  AlbumTransferData,
  UserTransferData,
  VideoTransferData,
} from 'src/transfer';

// ? interfase for database ?
export abstract class IDatabase<T, O> {
  abstract create(options: { [key in keyof O]: O[key] }): Promise<T>;
  abstract delete(id: Types.ObjectId): Promise<T>;
  abstract update(id: Types.ObjectId, options: { [key in keyof O]: O[key] }): Promise<T>;

  protected abstract findByIdAndCheck(id: Types.ObjectId): Promise<T>;
  protected abstract findOneByAndCheck(options: { [key in keyof O]: O[key] }): Promise<T>;
  protected abstract getAll(count: number, offset: number): Promise<T[]>;
  protected abstract findAllBy(options: { [key in keyof O]: O[key] }): Promise<T[]>;
  protected abstract findAllByIds(ids: Types.ObjectId[]): Promise<T[]>;
}

export interface IDefaultService<T, O> {
  getOneBy(options: { [key in keyof O]: O[key] }): Promise<T>;
  getOneById(id: Types.ObjectId): Promise<T>;
  getOneByIdAndCheck: (id: Types.ObjectId) => Promise<T>;
  getOneByAndCheck: (options: { [key in keyof O]: O[key] }) => Promise<T>;
  getAllBy(options: { [key in keyof O]: O[key] }): Promise<T[]>;
  getAllByIds(ids: Types.ObjectId[]): Promise<T[]>;
}

export interface UserReq extends Request {
  userTD: UserTransferData;
}

export interface UserRes extends Response {
  zip: (arr: { path: string; name: string }[]) => any;
}

export enum AccessTypes {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  LINK = 'LINK',
}

export enum ItemTypes {
  FOLDER = 'FOLDER',
  TRACK = 'TRACK',
  FILE = 'FILE',
  ALBUM = 'ALBUM',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export type ObjectServices = {
  [ItemTypes.FOLDER]: FolderService;
  [ItemTypes.TRACK]: TrackService;
  [ItemTypes.FILE]: FileService;
  [ItemTypes.ALBUM]: AlbumService;
  [ItemTypes.IMAGE]: ImageService;
  [ItemTypes.VIDEO]: VideoService;
};

export type ObjectServicesKeys = keyof ObjectServices;

export type StorageCollectionNames = 'folders' | 'tracks' | 'files' | 'albums' | 'videos';

export const StorageItemTypes: ItemTypes[] = [
  ItemTypes.FOLDER,
  ItemTypes.TRACK,
  ItemTypes.FILE,
  ItemTypes.ALBUM,
  ItemTypes.IMAGE,
  ItemTypes.VIDEO,
];

export type ItemsData = {
  count: number;
  items: ItemDocument[];
  size: number;
};

export type ItemDocument =
  | FolderDocument
  | TrackDocument
  | FileDocument
  | AlbumDocument
  | ImageDocument
  | VideoDocument;
export interface ItemDto {
  id: Types.ObjectId;
  type: ItemTypes;
}

export type ItemTransferData =
  | FolderTransferData
  | TrackTransferData
  | FileTransferData
  | AlbumTransferData
  | ImageTransferData
  | VideoTransferData;

export type Modify<T, R> = Omit<T, keyof R> & R;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface ChildrensTransferData {
  childrens: ItemTransferData[];
  parents: FolderTransferData[];
}
