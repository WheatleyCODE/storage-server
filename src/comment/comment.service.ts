import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DefaultService } from 'src/core';
import { Comment, CommentDocument } from './schemas/comment.schema';
import {
  ICommentService,
  ItemsData,
  ICreateCommentOptions,
  IUpdateCommentOptions,
} from 'src/types';

@Injectable()
export class CommentService
  extends DefaultService<CommentDocument, IUpdateCommentOptions>
  implements ICommentService
{
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {
    super(commentModel);
  }

  async create(options: ICreateCommentOptions): Promise<CommentDocument> {
    try {
      return await this.commentModel.create({
        ...options,
        changeDate: Date.now(),
        createDate: Date.now(),
      });
    } catch (e) {
      throw new HttpException('Ошибка при создании комментария', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: Types.ObjectId): Promise<CommentDocument & ItemsData> {
    try {
      let deletedComments: CommentDocument[] = [];

      const comment = await this.model.findByIdAndDelete(id);
      const comments = await this.model.find({ answerFor: comment._id });
      deletedComments.push(comment);
      deletedComments = [...deletedComments, ...comments];

      for await (const delComment of deletedComments) {
        await delComment.delete();
      }

      const itemsData = {
        count: deletedComments.length,
        items: deletedComments as any,
        size: 0,
      };

      return Object.assign(comment, itemsData);
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
