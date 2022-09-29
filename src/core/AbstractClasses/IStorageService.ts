import { Types } from 'mongoose';
import { ItemTypes } from 'src/types';
import { IDefaultService } from './IDefaultService';

// ! Change
export type FolderDemo = {
  hellO: 'World';
};

export abstract class IStorageService<T, O> extends IDefaultService<T, O> {
  abstract changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract addItem(
    id: Types.ObjectId,
    item: Types.ObjectId,
    type: ItemTypes,
  ): Promise<T>;
  abstract deleteItem(id: Types.ObjectId, item: Types.ObjectId): Promise<T>;
  abstract searchItems(
    id: Types.ObjectId,
    options: { [key in keyof FolderDemo]: any },
  ): Promise<T[]>;
}
