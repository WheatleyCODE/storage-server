import { Types } from 'mongoose';
import { CommentDocument } from 'src/comment/schemas/comment.schema';

export interface ICommentService<T, O> {
  someRandom: null;
}

export interface IStorageItemComments<T> {
  addComment(id: Types.ObjectId, options: CreateCommentOptions): Promise<CommentDocument>;
  deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<T>;
}

export type CreateCommentOptions = {
  title: string;
  text: string;
  user: Types.ObjectId;
  answer?: Types.ObjectId;
};

export type UpdateCommentOptions = {
  title?: string;
  text?: string;
  user?: Types.ObjectId;
  answer?: Types.ObjectId;
};
