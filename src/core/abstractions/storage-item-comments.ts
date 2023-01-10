import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { CreateCommentOptions, IStorageItemComments } from 'src/types';
import { StorageItem } from './storage-item';

export abstract class StorageItemComments<T, O>
  extends StorageItem<T, O>
  implements IStorageItemComments<T>
{
  constructor(model: Model<any>, private commentService: CommentService) {
    super(model);
  }

  async addComment(id: Types.ObjectId, options: CreateCommentOptions): Promise<CommentDocument> {
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

  async deleteComment(id: Types.ObjectId, comment: Types.ObjectId): Promise<T> {
    try {
      const itemDoc: any = await this.findByIdAndCheck(id);
      const { items } = await this.commentService.delete(comment);

      items.forEach((item) => {
        itemDoc.comments = itemDoc.comments.filter(
          (itm) => item._id.toString() !== itm._id.toString(),
        );
      });

      await itemDoc.save();

      return itemDoc;
    } catch (e) {
      throw e;
    }
  }
}