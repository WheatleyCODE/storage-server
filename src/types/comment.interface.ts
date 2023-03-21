import { Types } from 'mongoose';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { DeepPartial } from './core.interface';

// ! Реализоввать комментарии
export interface ICommentService {
  // someRandom: null;
}

export interface IStorageItemComments {
  addComment(id: Types.ObjectId, options: ICreateCommentOptions): Promise<CommentDocument>;
  deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<CommentDocument>;
}

export interface ICreateCommentOptions {
  text: string;
  user: Types.ObjectId;
  answerFor: Types.ObjectId;
}

export interface IUpdateCommentOptions extends DeepPartial<ICreateCommentOptions> {}
