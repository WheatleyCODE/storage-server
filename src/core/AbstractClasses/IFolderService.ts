import { Types } from 'mongoose';
import { FolderColors } from 'src/types';
import { IDefaultObject } from './IDefaultObject';

export abstract class IFolderService<T, O> extends IDefaultObject<T, O> {
  abstract addParent(id: Types.ObjectId, parent: Types.ObjectId): Promise<T>;
  abstract getParents(id: Types.ObjectId): Promise<T>;
  abstract getChildrens(parent: Types.ObjectId): Promise<T>;
  abstract changeColor(id: Types.ObjectId, color: FolderColors): Promise<T>;
}
