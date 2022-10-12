import { Types } from 'mongoose';
import { StorageCollectionsPopulated } from 'src/types';

export class StorageTransferData {
  constructor(
    storage: StorageCollectionsPopulated,
    readonly id: Types.ObjectId = storage._id,
    readonly name = storage.name,
    readonly diskSpace = storage.diskSpace,
    readonly usedSpace = storage.usedSpace,
    readonly folders = storage.folders,
    readonly tracks = storage.tracks,
    readonly files = storage.files,
    readonly albums = storage.albums,
  ) {}
}
