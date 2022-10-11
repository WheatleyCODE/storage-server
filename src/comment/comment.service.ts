import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICommentService } from 'src/core/Interfaces/ICommentService';
import { ItemsData } from 'src/types';
import { CreateCommentOptions, UpdateCommentOptions } from 'src/types/comment';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService extends ICommentService<CommentDocument, UpdateCommentOptions> {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }

  async create(options: CreateCommentOptions): Promise<CommentDocument> {
    try {
      return await this.commentModel.create({
        ...options,
      });
    } catch (e) {
      throw new HttpException('Ошибка при создании комментария', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: Types.ObjectId): Promise<CommentDocument & ItemsData> {
    try {
      const deletedComments: CommentDocument[] = [];
      const firstComment = await this.findByIdAndCheck(id);
      deletedComments.push(firstComment);

      const firstChildrens = await this.commentModel.find({ answer: id });

      const reqDel = async (childrens: CommentDocument[]) => {
        for await (const children of childrens) {
          deletedComments.push(children);

          const childs = await this.commentModel.find({ answer: children._id });

          if (childs.length !== 0) {
            await reqDel(childs);
          }
        }
      };

      await reqDel(firstChildrens);

      await this.deleteByIds(deletedComments.map((comment) => comment._id));

      const itemsData = {
        count: deletedComments.length,
        items: deletedComments as any,
        size: 0,
      };

      return Object.assign(firstComment, itemsData);
    } catch (e) {
      throw new HttpException('Ошибка при удалении', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<CommentDocument[]> {
    try {
      const deleteComments: CommentDocument[] = [];

      for await (const id of ids) {
        const comment = await this.commentModel.findByIdAndDelete(id);
        deleteComments.push(comment);
      }

      return deleteComments;
    } catch (e) {
      throw e;
    }
  }
}
