import { Types } from 'mongoose';
import { CommentDocument } from 'src/comment/schemas/comment.schema';

export class CommentTransferData {
  readonly id: Types.ObjectId;
  readonly title: string;
  readonly user: Types.ObjectId;
  readonly answer: Types.ObjectId;

  constructor(commentDocument: CommentDocument) {
    this.id = commentDocument._id;
    this.title = commentDocument.title;
    this.user = commentDocument.user;
    this.answer = commentDocument.answer;
  }
}
