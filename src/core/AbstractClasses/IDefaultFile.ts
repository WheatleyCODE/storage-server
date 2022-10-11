import { ReadStream } from 'fs';
import { Types } from 'mongoose';
import { ItemsData } from 'src/types';
import { IDefaultObject } from './IDefaultObject';

export abstract class IDefaultFile<T, O> extends IDefaultObject<T, O> {
  abstract download(id: Types.ObjectId): Promise<ReadStream>;
  abstract copy(id: Types.ObjectId): Promise<T & ItemsData>;
}
