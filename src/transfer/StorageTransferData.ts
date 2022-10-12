import { Types } from 'mongoose';
import { StorageDocument } from 'src/storage/schemas/storage.schema';

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
