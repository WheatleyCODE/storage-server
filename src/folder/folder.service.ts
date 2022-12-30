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
  CreateFolderOptions,
  UpdateFolderOptions,
} from 'src/types';

@Injectable()
export class FolderService
  extends StorageItemComments<FolderDocument, UpdateFolderOptions>
  implements IFolderService<FolderDocument>
{
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

  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<FolderDocument>,
    commentService: CommentService,
  ) {
    super(folderModel, commentService);
  }

  async create(options: CreateFolderOptions): Promise<FolderDocument> {
    try {
      return await this.folderModel.create({ ...options });
    } catch (e) {
      throw new HttpException('Ошибка при создании папки', HttpStatus.BAD_REQUEST);
    }
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

      const itemsData: ItemsData = {
        count: deletedFolders.length,
        items: deletedFolders,
        size: deletedFolders.length * this.ITEM_WIEGTH,
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
