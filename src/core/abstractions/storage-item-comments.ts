import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { ICreateCommentOptions, IStorageItemComments } from 'src/types';
import { StorageItem } from './storage-item';

export abstract class StorageItemComments<T, O>
  extends StorageItem<T, O>
  implements IStorageItemComments
{
  constructor(model: Model<any>, private commentService: CommentService) {
    super(model);
  }

  async addComment(id: Types.ObjectId, options: ICreateCommentOptions): Promise<CommentDocument> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      const comment = await this.commentService.create(options);
      item.comments.push(comment._id);
      await item.save();

      return comment;
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<CommentDocument> {
    try {
      const itemDoc: any = await this.findByIdAndCheck(id);
      const delComment = await this.commentService.delete(comment);
      const { items } = delComment;

      const ids = items.map((item) => item._id.toString());

      itemDoc.comments = [...itemDoc.comments].filter((com) => !ids.includes(com.toString()));

      await itemDoc.save();

      return delComment;
    } catch (e) {
      throw e;
    }
  }

  async getComments(id: Types.ObjectId): Promise<CommentDocument[]> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      await item.populate('comments');

      return [...item.comments];
    } catch (e) {
      throw e;
    }
  }
}
