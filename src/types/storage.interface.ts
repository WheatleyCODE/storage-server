import { Types } from 'mongoose';
import { AlbumDocument } from 'src/album/schemas/album.schema';
import { FileDocument } from 'src/file/schemas/file.schema';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { ImageDocument } from 'src/image/schemas/image.schema';
import { StorageDocument } from 'src/storage/schemas/storage.schema';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { VideoDocument } from 'src/video/schemas/video.schema';
import { DeepPartial, Modify } from './core.interface';
import { AddItemDto } from 'src/storage/dto/add-item.dto';

export interface IStorageService<T> {
  changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  addUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  changeUsedSpace(user: Types.ObjectId, prevSize, newSize): Promise<StorageDocument>;
  addItem(dto: AddItemDto, size: number): Promise<T>;
}

export interface ICreateStorageOptions {
  user: Types.ObjectId;
  name: string;
  diskSpace?: number;
  usedSpace?: number;
  folders?: Types.ObjectId[];
}

export interface IUpdateStorageOptions extends DeepPartial<ICreateStorageOptions> {}

export type PopulatedCollections = {
  folders: FolderDocument[];
  tracks: TrackDocument[];
  files: FileDocument[];
  albums: AlbumDocument[];
  images: ImageDocument[];
  videos: VideoDocument[];
};

export type StorageCollectionsPopulated = Modify<StorageDocument, PopulatedCollections>;
