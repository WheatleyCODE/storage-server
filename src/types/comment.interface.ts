import { Types } from 'mongoose';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { DeepPartial } from './core.interface';

export interface ICommentService<T, O> {
  someRandom: null;
}

export interface IStorageItemComments<T> {
  addComment(id: Types.ObjectId, options: ICreateCommentOptions): Promise<CommentDocument>;
  deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<T>;
}

export interface ICreateCommentOptions {
  title: string;
  text: string;
  user: Types.ObjectId;
  answer?: Types.ObjectId;
}

export interface IUpdateCommentOptions extends DeepPartial<ICreateCommentOptions> {}
