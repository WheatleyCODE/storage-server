import { Types } from 'mongoose';
import { AccessTypes } from 'src/types';

export interface IStorageItem<T> {
  changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T>;
  changeAccessLink(id: Types.ObjectId): Promise<T>;
  changeOpenDate(id: Types.ObjectId): Promise<T>;
  changeIsTrash(id: Types.ObjectId, isTrash: boolean): Promise<T>;
  changeName(id: Types.ObjectId, name: string): Promise<T>;
  changeParent(id: Types.ObjectId, parent: Types.ObjectId | null): Promise<T>;
  getChildrens(parent: Types.ObjectId): Promise<T[]>;
  changeLike(id: Types.ObjectId, user: Types.ObjectId, isLike: boolean): Promise<T>;
  addListen(id: Types.ObjectId): Promise<T>;
  changeStar(id: Types.ObjectId, isStar: boolean, user?: Types.ObjectId): Promise<T>;
  getAllPublic(count: number, offset: number): Promise<T[]>;
  searchPublic(text: string, count: number, offset: number): Promise<T[]>;
}
