import { Types } from 'mongoose';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { AccessTypes, CreateCommentOptions } from 'src/types';

export interface IStorageItem<T> {
  readonly ITEM_WIEGTH: number;

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
  addComment(id: Types.ObjectId, options: CreateCommentOptions): Promise<CommentDocument>;
  deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<T>;
}
