import { Model, Types } from 'mongoose';
import * as uuid from 'uuid';
import { IDefaultService } from './IDefaultService';
import { CommentService } from 'src/comment/comment.service';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { CreateCommentOptions } from 'src/types/comment';
import { AccessTypes } from 'src/types';

export abstract class IDefaultObject<T, O> extends IDefaultService<T, O> {
  constructor(model: Model<any>, private readonly commentService: CommentService) {
    super(model);
  }
  readonly ITEM_WIEGTH = 8;

  abstract deleteByIds(ids: Types.ObjectId[]): Promise<T[]>;

  async changeAccessType(id: Types.ObjectId, type: AccessTypes): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.accessType = type;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      const link = uuid.v4();
      const type = item.type.toLowerCase();
      item.accessLink = `share/${type}/${link}`;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.openDate = Date.now();
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(id: Types.ObjectId, isTrash: boolean): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.isTrash = isTrash;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeName(id: Types.ObjectId, name: string): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      item.name = name;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async changeParent(id: Types.ObjectId, parent: Types.ObjectId | null): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      item.parent = parent === null ? undefined : parent;
      return item.save();
    } catch (e) {
      throw e;
    }
  }

  async getChildrens(parent: Types.ObjectId): Promise<T[]> {
    try {
      return await this.model.find({ parent });
    } catch (e) {
      throw e;
    }
  }

  async changeLike(id: Types.ObjectId, user: Types.ObjectId, isLike: boolean): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      if (isLike) {
        item.likeCount++;
        item.likedUsers.push(user);
        return await item.save();
      }

      item.likeCount--;
      item.likedUsers = item.likedUsers.filter(
        (likedUser) => likedUser.toString() !== user.toString(),
      );
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  async addListen(id: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);
      item.listenCount++;
      return await item.save();
    } catch (e) {
      throw e;
    }
  }

  // ! Локально расширить user?: Types.ObjectId
  async changeStar(id: Types.ObjectId, isStar: boolean, user?: Types.ObjectId): Promise<T> {
    try {
      const item: any = await this.findByIdAndCheck(id);

      if (isStar) {
        item.starredCount++;
      } else {
        item.starredCount--;
      }
      return await item.save();
    } catch (e) {
      throw e;
    }
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
