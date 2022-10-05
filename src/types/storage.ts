import { Types } from 'mongoose';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { StorageDocument } from 'src/storage/schemas/storage.schema';
import { TrackDocument } from 'src/track/schemas/track.schema';
import { Modify } from './core';

export type CreateStorageOptions = {
  user: Types.ObjectId;
  name: string;
  diskSpace?: number;
  usedSpace?: number;
  folders?: Types.ObjectId[];
};

export type UpdateStorageOptions = {
  user?: Types.ObjectId;
  name?: string;
  diskSpace?: number;
  usedSpace?: number;
  folders?: Types.ObjectId[];
};

export class StorageTransferData {
  readonly id: Types.ObjectId;
  readonly name: Types.ObjectId;
  readonly diskSpace: number;
  readonly usedSpace: number;
  readonly folders: Types.ObjectId[];

  constructor(storageDocument: StorageDocument) {
    this.id = storageDocument._id;
    this.name = storageDocument.name;
    this.diskSpace = storageDocument.diskSpace;
    this.usedSpace = storageDocument.usedSpace;
    this.folders = storageDocument.folders;
  }
}

export type PopulatedCollections = {
  folders: FolderDocument[];
  tracks: TrackDocument[];
};

export type StorageCollectionsPopulated = Modify<StorageDocument, PopulatedCollections>;
