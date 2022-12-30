import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { StorageItemComments } from 'src/core';
import { CommentService } from 'src/comment/comment.service';
import { FilesService } from 'src/files/files.service';
import { Image, ImageDocument } from './schemas/image.schema';
import {
  ItemsData,
  FileType,
  IImageService,
  CreateImageOptions,
  UpdateImageOptions,
} from 'src/types';

@Injectable()
export class ImageService
  extends StorageItemComments<ImageDocument, UpdateImageOptions>
  implements IImageService<ImageDocument>
{
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    private readonly filesService: FilesService,
    commentService: CommentService,
  ) {
    super(imageModel, commentService);
  }

  // ! Временно
  changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<ImageDocument> {
    throw new Error('Method not implemented.');
  }

  async create(options: CreateImageOptions): Promise<ImageDocument> {
    try {
      const pathFile = await this.filesService.createFile(FileType.IMAGE, options.image);
      return await this.imageModel.create({
        ...options,
        image: pathFile,
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<ImageDocument & ItemsData> {
    try {
      const deletedImage = await this.imageModel.findByIdAndDelete(id);
      if (!deletedImage) throw new HttpException('Трек не найден', HttpStatus.BAD_REQUEST);

      await this.filesService.removeFile(deletedImage.file);

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedImage],
        size: deletedImage.fileSize,
      };
      return Object.assign(deletedImage, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }> {
    try {
      const { name, file, fileExt } = await this.findByIdAndCheck(id);
      const fileStream = await this.filesService.downloadFile(file);
      const filename = `${name}.${fileExt}`;

      return { file: fileStream, filename };
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }> {
    try {
      const { name, file, fileExt } = await this.findByIdAndCheck(id);
      const path = await this.filesService.getFilePath(file);
      const filename = `${name}.${fileExt}`;

      return { path, filename };
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<ImageDocument & ItemsData> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, file, fileSize, parent } = imageDoc;

      const imageNewPath = await this.filesService.copyFile(file, FileType.IMAGE);

      const newImage = await this.imageModel.create({
        user,
        name: `${name} copy`,
        isTrash,
        parent,
        image: imageNewPath,
        fileSize,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newImage],
        size: fileSize,
      };

      return Object.assign(newImage, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<ImageDocument[]> {
    try {
      const deletedImages: ImageDocument[] = [];

      for await (const id of ids) {
        const deleteImage = await this.delete(id);
        deletedImages.push(deleteImage);
      }

      return deletedImages;
    } catch (e) {
      throw new HttpException(
        'Ошибка при удалении картинок по IDS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
