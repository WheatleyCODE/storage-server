import { CommentDocument } from 'src/comment/schemas/comment.schema';

export class CommentTransferData {
  constructor(
    comment: CommentDocument,
    readonly id = comment._id,
    readonly title = comment.title,
    readonly text = comment.text,
    readonly user = comment.user,
    readonly answers = comment.answers,
  ) {}
}
