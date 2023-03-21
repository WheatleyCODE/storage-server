import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { UserTransferData } from './user.transfer-data';

export class CommentTransferData {
  constructor(
    comment: CommentDocument,
    readonly id = comment._id,
    readonly text = comment.text,
    readonly user = new UserTransferData(comment.user as any),
    readonly answerFor = comment.answerFor,
    readonly createDate = comment.createDate,
  ) {}
}
