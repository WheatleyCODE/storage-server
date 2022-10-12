import { CommentDocument } from 'src/comment/schemas/comment.schema';

export class CommentTransferData {
  constructor(
    comment: CommentDocument,
    readonly id = comment._id,
    readonly title = comment.title,
    readonly user = comment.user,
    readonly answer = comment.answer,
  ) {}
}
