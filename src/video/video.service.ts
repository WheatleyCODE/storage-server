import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { StorageItemComments } from 'src/core';
import { FilesService } from 'src/files/files.service';
import { Video, VideoDocument } from './schemas/video.schema';
import { CommentService } from 'src/comment/comment.service';
import { VideoTransferData } from 'src/transfer';
import {
  ItemsData,
  FileType,
  IUpdateVideoOptions,
  ICreateVideoOptions,
  IVideoService,
  ItemTypes,
  IDownloadData,
  AccessTypes,
  DeepPartial,
} from 'src/types';
import { CreateVideoDto } from './dto/create-video.dto';
import { StorageService } from 'src/storage/storage.service';
import { delFildsByObj, dtoToOjbectId } from 'src/utils';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
import { ChangeVideoDataDto } from './dto/change-video-data';

@Injectable()
export class VideoService
  extends StorageItemComments<VideoDocument, IUpdateVideoOptions>
  implements IVideoService<VideoDocument>
{
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<VideoDocument>,
    private readonly filesService: FilesService,
    private readonly storageService: StorageService,
    commentService: CommentService,
  ) {
    super(videoModel, commentService);
  }

  async createVideo(
    dto: CreateVideoDto,
    user: Types.ObjectId,
    video: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<VideoTransferData> {
    try {
      const storage = await this.storageService.getOneByAndCheck({ user });

      const corDto = dtoToOjbectId(dto, ['parent']);

      const videoDoc = await this.create({
        ...corDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image?.size,
        video,
        videoSize: video.size,
        user,
      });

      let size = video.size;
      if (image?.size) size += image.size;

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: videoDoc._id,
          itemType: videoDoc.type,
        },
        size,
      );

      return new VideoTransferData(videoDoc);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateVideoOptions): Promise<VideoDocument> {
    try {
      let pathImage: string;

      if (options.image)
        pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);

      const pathVideo = await this.filesService.createFile(FileType.VIDEO, options.video);
      const fileExt = pathVideo.split('.').pop();

      return await this.videoModel.create({
        type: ItemTypes.VIDEO,
        ...options,
        file: pathVideo,
        fileSize: options.videoSize,
        fileExt,
        image: pathImage,
        createDate: Date.now(),
        changeDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<VideoDocument & ItemsData> {
    try {
      const deletedVideo = await this.videoModel.findByIdAndDelete(id);

      if (!deletedVideo) throw new HttpException('Видео файл не найден', HttpStatus.BAD_REQUEST);

      await this.filesService.removeFile(deletedVideo.file);

      if (deletedVideo.image) {
        await this.filesService.removeFile(deletedVideo.image);
      }

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedVideo],
        size: deletedVideo.fileSize + (deletedVideo.imageSize || 0),
      };

      return Object.assign(deletedVideo, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async changeFile(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    video: Express.Multer.File,
  ): Promise<VideoTransferData> {
    try {
      const { id } = dtoToOjbectId(dto, ['id']);
      const videoDoc = await this.changeDate(id, ['changeDate']);

      await this.storageService.changeUsedSpace(user, videoDoc.fileSize, video.size);

      const newPathAudio = await this.filesService.changeFile(FileType.VIDEO, video, videoDoc.file);
      videoDoc.file = newPathAudio;
      videoDoc.fileSize = video.size;

      await videoDoc.save();

      return new VideoTransferData(videoDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeImage(
    dto: ChangeFileDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<VideoTransferData> {
    try {
      const { id } = dtoToOjbectId(dto, ['id']);
      const videoDoc = await this.changeDate(id, ['changeDate']);

      await this.storageService.changeUsedSpace(user, videoDoc.imageSize, image.size);

      const newPathImage = await this.filesService.changeFile(
        FileType.IMAGE,
        image,
        videoDoc.image,
      );

      videoDoc.image = newPathImage;
      videoDoc.imageSize = image.size;

      await videoDoc.save();

      return new VideoTransferData(videoDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeData(dto: ChangeVideoDataDto): Promise<VideoTransferData> {
    try {
      const { id, name, description } = dtoToOjbectId(dto, ['id']);
      await this.changeDate(id, ['changeDate']);
      const videoDoc = await this.update(id, { name, description });
      return new VideoTransferData(videoDoc);
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<VideoDocument & ItemsData> {
    try {
      const videoDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, description, imageSize, fileSize, parent, fileExt, type } =
        videoDoc;

      let imageNewPath;

      if (videoDoc.image) {
        imageNewPath = await this.filesService.copyFile(videoDoc.image, FileType.IMAGE);
      }

      const videoNewPath = await this.filesService.copyFile(videoDoc.file, FileType.VIDEO);

      const newVideo = await this.videoModel.create({
        type,
        user,
        name: `${name} copy`,
        description,
        imageSize,
        parent,
        fileSize,
        isTrash,
        audio: imageNewPath,
        file: videoNewPath,
        fileExt,
        openDate: Date.now(),
        createDate: Date.now(),
        changeDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newVideo],
        size: fileSize + (imageSize || 0),
      };

      return Object.assign(newVideo, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<IDownloadData[]> {
    try {
      const { name, file, fileExt, image } = await this.findByIdAndCheck(id);
      const imagePath = await this.filesService.getFilePath(image);
      const imageExt = imagePath.split('.').pop();
      const imageName = `${name}-img.${imageExt}`;

      const path = await this.filesService.getFilePath(file);
      const filename = `${name}.${fileExt}`;

      return [
        { path, name: filename },
        { path: imagePath, name: imageName },
      ];
    } catch (e) {
      throw e;
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

  async restore(id: Types.ObjectId, options: DeepPartial<VideoDocument>): Promise<VideoDocument> {
    try {
      const updateData = delFildsByObj<
        DeepPartial<VideoDocument>,
        'file' | 'fileExt' | 'fileSize' | 'image' | 'imageSize' | 'album'
      >(options, ['file', 'fileExt', 'fileSize', 'image', 'imageSize']);

      return await this.update(id, updateData);
    } catch (e) {
      throw e;
    }
  }
}
