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
// import { DeleteItemDto } from 'src/storage/dto/delete-item.dto';
// import { AddListenDto } from 'src/storage/dto/add-listen.dto';
// import { ChangeAccessTypeDto } from 'src/storage/dto/change-access-type.dto';
// import { ChangeIsTrashDto } from 'src/storage/dto/change-is-trash.dto';
// import { ChangeLikeDto } from 'src/storage/dto/change-like.dto';
// import { ChangeOpenDateDto } from 'src/storage/dto/change-open-date.dto';
// import { CopyFileDto } from 'src/storage/dto/copy-file.dto';
// import { CreateAccessLinkDto } from 'src/storage/dto/create-access-link.dto';
// import { SearchItemDto } from 'src/storage/dto/search-item.dto';
// import { StorageTransferData } from 'src/transfer';
// import { ItemTransferData } from 'src/types';

export interface IStorageService<T> {
  changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  addItem(dto: AddItemDto, size: number): Promise<T>;
  // deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData>;
  // searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
  // changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData>;
  // changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData>;
  // changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]>;
  // changeLike(dto: ChangeOpenDateDto): Promise<ItemTransferData>;
  // addListen(dto: AddListenDto): Promise<ItemTransferData>;
  // changeOpenDate(dto: ChangeLikeDto): Promise<ItemTransferData>;
  // checkParentsAndDelete(storage: Types.ObjectId): Promise<T>;
  // copyFile(dto: CopyFileDto, user: Types.ObjectId): Promise<ItemTransferData[]>;
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
