import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentService } from 'src/comment/comment.service';
import { StorageItemComments } from 'src/core';
import { FilesService } from 'src/files/files.service';
import { File, FileDocument } from './schemas/file.schema';
import {
  ItemsData,
  FileType,
  IFileService,
  ICreateFileOptions,
  IUpdateFileOptions,
  ItemTypes,
  IDownloadData,
  DeepPartial,
} from 'src/types';
import { FileTransferData } from 'src/transfer';
import { CreateFileDto } from './dto/create-file.dto';
import { delFildsByObj, dtoToOjbectId } from 'src/utils';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class FileService
  extends StorageItemComments<FileDocument, IUpdateFileOptions>
  implements IFileService<FileDocument>
{
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly filesService: FilesService,
    private readonly storageService: StorageService,
    commentService: CommentService,
  ) {
    super(fileModel, commentService);
  }

  async createFile(
    dto: CreateFileDto,
    user: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<FileTransferData> {
    try {
      const storage = await this.storageService.getOneByAndCheck({ user });

      const correctDto = dtoToOjbectId(dto, ['parent']);

      const fileDoc = await this.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        file,
        fileSize: file.size,
        user,
      });

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: fileDoc._id,
          itemType: fileDoc.type,
        },
        fileDoc.fileSize,
      );

      return new FileTransferData(fileDoc);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateFileOptions): Promise<FileDocument> {
    try {
      const pathFile = await this.filesService.createFile(FileType.FILE, options.file);
      const fileExt = pathFile.split('.').pop();

      return await this.fileModel.create({
        ...options,
        type: ItemTypes.FILE,
        file: pathFile,
        fileExt,
        createDate: Date.now(),
        changeDate: Date.now(),
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

  async changeFile(id: Types.ObjectId, file: Express.Multer.File): Promise<FileDocument> {
    try {
      const fileDoc = await this.changeDate(id, ['changeDate']);

      const newPathFile = await this.filesService.changeFile(FileType.FILE, file, fileDoc.file);
      fileDoc.file = newPathFile;
      fileDoc.fileSize = file.size;

      return await fileDoc.save();
    } catch (e) {
      throw e;
    }
  }

  async getFilePath(id: Types.ObjectId): Promise<IDownloadData[]> {
    try {
      const { name, file, fileExt } = await this.findByIdAndCheck(id);
      const path = await this.filesService.getFilePath(file);
      const filename = `${name}.${fileExt}`;

      return [{ path, name: filename }];
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<FileDocument & ItemsData> {
    try {
      const fileDoc = await this.findByIdAndCheck(id);
      const { user, name, isTrash, file, fileSize, parent, type, fileExt } = fileDoc;

      const fileNewPath = await this.filesService.copyFile(file, FileType.FILE);

      const newFile = await this.fileModel.create({
        type,
        user,
        parent,
        name: `${name} copy`,
        isTrash,
        fileExt,
        file: fileNewPath,
        fileSize,
        createDate: Date.now(),
        openDate: Date.now(),
        changeDate: Date.now(),
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

  async restore(id: Types.ObjectId, options: DeepPartial<FileDocument>): Promise<FileDocument> {
    try {
      const updateData = delFildsByObj<DeepPartial<FileDocument>, 'file' | 'fileExt' | 'fileSize'>(
        options,
        ['file', 'fileExt', 'fileSize'],
      );

      return await this.update(id, updateData);
    } catch (e) {
      throw e;
    }
  }
}
