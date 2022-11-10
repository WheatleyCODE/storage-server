import { Types } from 'mongoose';
import { FolderColors } from 'src/types';
import { IDefaultObject } from '../AbstractClasses/IDefaultObject';

export abstract class IFolderService<T, O> extends IDefaultObject<T, O> {
  abstract getParents(id: Types.ObjectId): Promise<T[]>;
  abstract changeColor(id: Types.ObjectId, color: FolderColors): Promise<T>;
}
