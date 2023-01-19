import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { ReadStream } from 'fs';
import { StorageItemComments } from 'src/core';
import { CommentService } from 'src/comment/comment.service';
import { Folder, FolderDocument } from './schemas/folder.schema';
import {
  ItemsData,
  FolderColors,
  IFolderService,
  ICreateFolderOptions,
  IUpdateFolderOptions,
  ItemTypes,
} from 'src/types';
import { CreateFolderDto } from './dto/create-folder.dto';
import { FolderTransferData } from 'src/transfer';
import { dtoToOjbectId } from 'src/utils';
import { StorageService } from 'src/storage/storage.service';
import { ChangeColorDto } from 'src/folder/dto/change-color.dto';

@Injectable()
export class FolderService
  extends StorageItemComments<FolderDocument, IUpdateFolderOptions>
  implements IFolderService<FolderDocument>
{
  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<FolderDocument>,
    commentService: CommentService,
    private readonly storageService: StorageService,
  ) {
    super(folderModel, commentService);
  }

  async createFolder(dto: CreateFolderDto, user: Types.ObjectId): Promise<FolderTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const folder = await this.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        user,
      });
      const FOLDER_SIZE = 0;

      const storage = await this.storageService.getOneBy({ user });

      await this.storageService.addItem(
        {
          storage: storage._id,
          item: folder._id,
          itemType: folder.type,
        },
        FOLDER_SIZE,
      );

      return new FolderTransferData(folder);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateFolderOptions): Promise<FolderDocument> {
    try {
      return await this.folderModel.create({
        ...options,
        type: ItemTypes.FOLDER,
        changeDate: Date.now(),
        createDate: Date.now(),
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Ошибка при создании папки', HttpStatus.BAD_REQUEST);
    }
  }

  async changeFolderColor(dto: ChangeColorDto): Promise<FolderTransferData[]> {
    try {
      const { color } = dto;
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      const folderDocs: FolderDocument[] = [];

      for await (const { id } of items) {
        const folderDoc = await this.changeColor(id, color);
        folderDocs.push(folderDoc);
      }

      return folderDocs.map((doc) => new FolderTransferData(doc));
    } catch (e) {
      throw e;
    }
  }

  // ! Временно
  download(id: Types.ObjectId): Promise<{ file: ReadStream; filename: string }> {
    throw new Error('Method not implemented.');
  }

  copy(id: Types.ObjectId): Promise<Folder & Document<any, any, any> & ItemsData> {
    throw new Error('Method not implemented.');
  }

  getFilePath(id: Types.ObjectId): Promise<{ path: string; filename: string }> {
    throw new Error('Method not implemented.');
  }

  async delete(id: Types.ObjectId): Promise<FolderDocument & ItemsData> {
    try {
      const deletedFolders: FolderDocument[] = [];

      const firstFolder = await this.findByIdAndCheck(id);
      deletedFolders.push(firstFolder);

      const firstChildrens = await this.folderModel.find({ parent: id });

      const reqDel = async (childrens: FolderDocument[]) => {
        for await (const children of childrens) {
          deletedFolders.push(children);

          const childs = await this.folderModel.find({ parent: children._id });

          if (childs.length !== 0) {
            await reqDel(childs);
          }
        }
      };

      await reqDel(firstChildrens);

      await this.deleteByIds(deletedFolders.map((folder) => folder._id));

      // ! fix zero
      const itemsData: ItemsData = {
        count: deletedFolders.length,
        items: deletedFolders,
        size: 0,
      };

      return Object.assign(firstFolder, itemsData);
    } catch (e) {
      throw new HttpException('Ошибка при удалении папки', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<FolderDocument[]> {
    try {
      const deleteFolders: FolderDocument[] = [];

      for await (const id of ids) {
        const folder = await this.folderModel.findByIdAndDelete(id);
        deleteFolders.push(folder);
      }

      return deleteFolders;
    } catch (e) {
      throw e;
    }
  }

  async getParents(id: Types.ObjectId): Promise<FolderDocument[]> {
    try {
      const parents = [];
      const folder = await this.findByIdAndCheck(id);

      parents.push(folder);
      let isParent = false;
      let current = folder;
      if (folder.parent) isParent = true;

      while (isParent) {
        if (!current.parent) {
          isParent = false;
          continue;
        }

        const parentFolder = await this.folderModel.findById(current.parent);
        parents.push(parentFolder);
        current = parentFolder;
      }

      return parents.reverse();
    } catch (e) {
      throw e;
    }
  }

  async changeColor(id: Types.ObjectId, color: FolderColors): Promise<FolderDocument> {
    try {
      const folder = await this.findByIdAndCheck(id);

      folder.color = color;
      return folder.save();
    } catch (e) {
      throw e;
    }
  }
}
