import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { CommentService } from 'src/comment/comment.service';
import { AddCommentDto } from 'src/commentator/dto/add-comment.dto';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { TrackService } from 'src/track/track.service';
import { CommentTransferData } from 'src/transfer';
import { ItemTypes, ObjectServices } from 'src/types';
import { dtoToOjbectId } from 'src/utils';
import { VideoService } from 'src/video/video.service';
import { DeleteCommentDto } from './dto/delete-comment.dto';

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
      const { id, type, answer, title, text } = dtoToOjbectId(dto, ['id', 'answer']);

      const comment = await this.objectServices[type].addComment(id, {
        title,
        text,
        answer,
        user,
      });

      return new CommentTransferData(comment);
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(dto: DeleteCommentDto): Promise<CommentTransferData> {
    try {
      const { id, type, comment } = dtoToOjbectId(dto, ['id', 'comment']);

      const delComment = await this.objectServices[type].deleteComment(id, comment);

      return new CommentTransferData(delComment);
    } catch (e) {
      throw e;
    }
  }
}
