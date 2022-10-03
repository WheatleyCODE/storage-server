import { Types } from 'mongoose';
import { StorageDocument } from 'src/storage/schemas/storage.schema';

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

  constructor(storageDocument: StorageDocument) {
    this.id = storageDocument._id;
  }
}
