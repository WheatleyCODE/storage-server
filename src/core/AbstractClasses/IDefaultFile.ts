import { Types } from 'mongoose';
import { ItemTypes } from 'src/types';
import { IDefaultObject } from './IDefaultObject';

export abstract class IDefaultFile<T, O> extends IDefaultObject<T, O> {
  abstract download(id: Types.ObjectId, type: ItemTypes): Promise<T>;
  abstract copy(id: Types.ObjectId, type: ItemTypes): Promise<T>;
}
