import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentDocument } from 'src/comment/schemas/comment.schema';
import { AddCommentDto } from 'src/commentator/dto/add-comment.dto';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { TrackService } from 'src/track/track.service';
import { CommentTransferData } from 'src/transfer';
import { ItemTypes, ObjectServices } from 'src/types';
import { UserService } from 'src/user/user.service';
import { dtoToOjbectId } from 'src/utils';
import { VideoService } from 'src/video/video.service';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';

@Injectable()
export class CommentatorService {
  private readonly objectServices: ObjectServices;

  constructor(
    readonly folderService: FolderService,
    readonly trackService: TrackService,
    readonly fileService: FileService,
    readonly albumService: AlbumService,
    readonly imageService: ImageService,
    readonly videoService: VideoService,
    readonly commentService: CommentService,
  ) {
    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };
  }
  async createComment(dto: AddCommentDto, user: Types.ObjectId): Promise<CommentTransferData> {
    try {
      const { id, type, answerFor, text } = dtoToOjbectId(dto, ['id', 'answerFor']);

      const comment = await this.objectServices[type].addComment(id, {
        text,
        user,
        answerFor,
      });

      await comment.populate('user');

      return new CommentTransferData(comment);
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(dto: DeleteCommentDto): Promise<CommentTransferData[]> {
    try {
      const { id, type, comment } = dtoToOjbectId(dto, ['id', 'comment']);

      await this.objectServices[type].deleteComment(id, comment);

      return await this.getComments(dto);
    } catch (e) {
      throw e;
    }
  }

  async getComments(dto: GetCommentsDto): Promise<CommentTransferData[]> {
    try {
      const { id, type } = dtoToOjbectId(dto, ['id']);

      const comments = await this.objectServices[type].getComments(id);

      for await (const comment of comments) {
        await comment.populate('user');
      }

      return comments.map((comment) => new CommentTransferData(comment));
    } catch (e) {
      throw e;
    }
  }
}
