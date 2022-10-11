import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReadStream } from 'fs';
import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { IFileService } from 'src/core/Interfaces/IFileService';
import { FilesService, FileType } from 'src/files/files.service';
import { ItemsData } from 'src/types';
import { CreateFileOptions, UpdateFileOptions } from 'src/types/file';
import { File, FileDocument } from './schemas/file.schema';

@Injectable()
export class FileService extends IFileService<FileDocument, UpdateFileOptions> {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly filesService: FilesService,
    commentService: CommentService,
  ) {
    super(fileModel, commentService);
  }

  async create(options: CreateFileOptions): Promise<FileDocument> {
    try {
      const pathFile = await this.filesService.createFile(FileType.FILE, options.file);

      return await this.fileModel.create({
        ...options,
        file: pathFile,
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<FileDocument & ItemsData> {
    try {
      const deletedFile = await this.fileModel.findByIdAndDelete(id);

      if (!deletedFile) throw new HttpException('Трек не найден', HttpStatus.BAD_REQUEST);

      await this.filesService.removeFile(deletedFile.file);

      const itemsData: ItemsData = {
        count: 1,
        items: [deletedFile],
        size: deletedFile.fileSize,
      };

      return Object.assign(deletedFile, itemsData);
    } catch (e) {
      throw e;
    }
  }

  // * Может пригодиться для сохранения результата онлайн редактора
  async changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<FileDocument> {
    try {
      const fileDoc = await this.findByIdAndCheck(id);

      const newPathFile = await this.filesService.changeFile(FileType.FILE, file, fileDoc.file);
      fileDoc.file = newPathFile;
      fileDoc.fileSize = file.size;

      return await fileDoc.save();
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<ReadStream> {
    try {
      const fileDoc = await this.findByIdAndCheck(id);
      const file = await this.filesService.downloadFile(fileDoc.file);
      return file;
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<FileDocument & ItemsData> {
    try {
      const fileDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, file, fileSize } = fileDoc;

      const fileNewPath = await this.filesService.copyFile(file, FileType.FILE);

      const newFile = await this.fileModel.create({
        user,
        name: `${name} copy`,
        isTrash,
        file: fileNewPath,
        fileSize,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      const itemsData: ItemsData = {
        count: 1,
        items: [newFile],
        size: fileSize,
      };

      return Object.assign(newFile, itemsData);
    } catch (e) {
      throw e;
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<FileDocument[]> {
    try {
      const deletedFiles: FileDocument[] = [];

      for await (const id of ids) {
        const deleteFile = await this.delete(id);

        deletedFiles.push(deleteFile);
      }

      return deletedFiles;
    } catch (e) {
      throw new HttpException(
        'Ошибка при удалении файлов по IDS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
