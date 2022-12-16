import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FilesService } from 'src/files/files.service';
import { Video, VideoDocument } from './schemas/video.schema';
import { ReadStream } from 'fs';
import { CommentService } from 'src/comment/comment.service';
import { VideoTransferData } from 'src/transfer';
import {
  AccessTypes,
  ItemsData,
  FileType,
  UpdateVideoOptions,
  CreateVideoOptions,
} from 'src/types';
import { IVideoService } from 'src/core/Interfaces/IVideoService';

@Injectable()
export class VideoService extends IVideoService<VideoDocument, UpdateVideoOptions> {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<VideoDocument>,
    private readonly filesService: FilesService,
    commentService: CommentService,
  ) {
    super(videoModel, commentService);
  }

  async create(options: CreateVideoOptions): Promise<VideoDocument> {
    try {
      let pathImage: string;

      if (options.image)
        pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      const pathVideo = await this.filesService.createFile(FileType.VIDEO, options.video);

      return await this.videoModel.create({
        ...options,
        video: pathVideo,
        image: pathImage,
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<VideoDocument & ItemsData> {
    try {
      const deletedVideo = await this.videoModel.findByIdAndDelete(id);

      if (!deletedVideo) throw new HttpException('Видео файл не найден', HttpStatus.BAD_REQUEST);

      await this.filesService.removeFile(deletedVideo.video);

      if (deletedVideo.image) {
        await this.filesService.removeFile(deletedVideo.image);
      }

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedVideo],
        size: deletedVideo.videoSize + (deletedVideo.imageSize || 0),
      };

      return Object.assign(deletedVideo, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async searchPublicVideos(text: string, count = 10, offset = 0): Promise<VideoTransferData[]> {
    try {
      const videos = await this.videoModel
        .find({ name: { $regex: new RegExp(text, 'i') } })
        .skip(offset)
        .limit(count);
      return videos.map((track) => new VideoTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске видео', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeFiles(
    id: Types.ObjectId,
    video?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<VideoDocument> {
    try {
      const videoDoc = await this.findByIdAndCheck(id);

      if (video) {
        const newPathVideo = await this.filesService.changeFile(
          FileType.AUDIO,
          video,
          videoDoc.video,
        );

        videoDoc.video = newPathVideo;
        videoDoc.videoSize = video.size;
      }

      if (image) {
        const newPathImage = await this.filesService.changeFile(
          FileType.IMAGE,
          image,
          videoDoc.image,
        );

        videoDoc.image = newPathImage;
        videoDoc.imageSize = image.size;
      }

      return await videoDoc.save();
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<VideoDocument & ItemsData> {
    try {
      const videoDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, description, imageSize, videoSize, parent } = videoDoc;

      let imageNewPath;

      if (videoDoc.image) {
        imageNewPath = await this.filesService.copyFile(videoDoc.image, FileType.IMAGE);
      }

      const videoNewPath = await this.filesService.copyFile(videoDoc.video, FileType.VIDEO);

      const newVideo = await this.videoModel.create({
        user,
        name: `${name} copy`,
        description,
        imageSize,
        parent,
        videoSize,
        isTrash,
        audio: imageNewPath,
        video: videoNewPath,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newVideo],
        size: videoSize + (imageSize || 0),
      };

      return Object.assign(newVideo, itemsData);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }> {
    try {
      const videoDoc = await this.findByIdAndCheck(id);
      const file = await this.filesService.downloadFile(videoDoc.video);
      const ext = videoDoc.video.split('.')[1];
      const filename = `${videoDoc.name}.${ext}`;

      return { file, filename };
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }> {
    try {
      const videoDoc = await this.findByIdAndCheck(id);
      const path = await this.filesService.getFilePath(videoDoc.video);
      const ext = videoDoc.video.split('.')[1];
      const filename = `${videoDoc.name}.${ext}`;

      return { path, filename };
    } catch (e) {
      throw e;
    }
  }

  async getAllPublicVideos(count = 10, offset = 0): Promise<VideoTransferData[]> {
    try {
      const videos = await this.videoModel
        .find({ accessType: AccessTypes.PUBLIC })
        .skip(offset)
        .limit(count);

      return videos.map((track) => new VideoTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске видео', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<VideoDocument[]> {
    try {
      const deletedVideos: VideoDocument[] = [];

      for await (const id of ids) {
        const deleteVideo = await this.delete(id);

        deletedVideos.push(deleteVideo);
      }

      return deletedVideos;
    } catch (e) {
      throw new HttpException('Ошибка при удалении видео по IDS', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
