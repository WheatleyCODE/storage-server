import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { StorageItem } from 'src/core';
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
  extends StorageItem<ImageDocument, UpdateImageOptions>
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

      await this.filesService.removeFile(deletedImage.image);

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedImage],
        size: deletedImage.imageSize,
      };
      return Object.assign(deletedImage, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const file = await this.filesService.downloadFile(imageDoc.image);
      const ext = imageDoc.image.split('.')[1];
      const filename = `${imageDoc.name}.${ext}`;

      return { file, filename };
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const path = await this.filesService.getFilePath(imageDoc.image);
      const ext = imageDoc.image.split('.')[1];
      const filename = `${imageDoc.name}.${ext}`;

      return { path, filename };
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<ImageDocument & ItemsData> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, image, imageSize, parent } = imageDoc;

      const imageNewPath = await this.filesService.copyFile(image, FileType.IMAGE);

      const newImage = await this.imageModel.create({
        user,
        name: `${name} copy`,
        isTrash,
        parent,
        image: imageNewPath,
        imageSize,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newImage],
        size: imageSize,
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
