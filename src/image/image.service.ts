import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { IDefaultFile } from 'src/core/AbstractClasses/IDefaultFile';
import { FilesService } from 'src/files/files.service';
import { ItemsData, FileType } from 'src/types';
import { CreateImageOptions, UpdateImageOptions } from 'src/types/image';
import { Image, ImageDocument } from './schemas/image.schema';

@Injectable()
export class ImageService extends IDefaultFile<ImageDocument, UpdateImageOptions> {
  constructor(
    @InjectModel(Image.name) private readonly imageModel: Model<ImageDocument>,
    private readonly filesService: FilesService,
    commentService: CommentService,
  ) {
    super(imageModel, commentService);
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

  async download(id: Types.ObjectId): Promise<ReadStream> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const image = await this.filesService.downloadFile(imageDoc.image);
      return image;
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<ImageDocument & ItemsData> {
    try {
      const imageDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, image, imageSize } = imageDoc;

      const imageNewPath = await this.filesService.copyFile(image, FileType.IMAGE);

      const newImage = await this.imageModel.create({
        user,
        name: `${name} copy`,
        isTrash,
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