import { Types } from 'mongoose';

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
