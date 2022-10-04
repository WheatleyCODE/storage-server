import { Types } from 'mongoose';
import { AddDeleteItemDto } from 'src/storage/dto/AddDeleteItem.dto';
import { SearchItemDto } from 'src/storage/dto/SearchItem.dto';
import { IDefaultService } from '../AbstractClasses/IDefaultService';

export abstract class IStorageService<T, O> extends IDefaultService<T, O> {
  abstract changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<T>;
  abstract changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<T>;

  abstract addItem(dto: AddDeleteItemDto): Promise<T>;
  abstract deleteItem(dto: AddDeleteItemDto): Promise<T>;

  abstract searchItems(dto: SearchItemDto): Promise<T[]>;
}
