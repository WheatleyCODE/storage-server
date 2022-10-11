import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { IFolderService } from 'src/core';
import { ItemsData, FolderColors } from 'src/types';
import { CreateFolderOptions, UpdateFolderOptions } from 'src/types/folder';

@Injectable()
export class FolderService extends IFolderService<FolderDocument, UpdateFolderOptions> {
  constructor(
    @InjectModel(Folder.name)
    private readonly folderModel: Model<FolderDocument>,
  ) {
    super(folderModel);
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

  async changeParent(id: Types.ObjectId, parent: Types.ObjectId): Promise<FolderDocument> {
    try {
      const folder = await this.findByIdAndCheck(id);
      folder.parent = parent;
      return folder.save();
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

  async getChildrens(parent: Types.ObjectId): Promise<FolderDocument[]> {
    try {
      return await this.folderModel.find({ parent });
    } catch (e) {
      throw new HttpException('Ошибка при поиске дочерних папок', HttpStatus.BAD_REQUEST);
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
