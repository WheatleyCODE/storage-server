import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { IFolderService } from 'src/core';
import { DeleteItems, FolderColors } from 'src/types';
import { CreateFolderOptions, UpdateFolderOptions } from 'src/types/folder';

@Injectable()
export class FolderService extends IFolderService<
  FolderDocument,
  UpdateFolderOptions
> {
  private deleteCounter = 0;
  private deleteFolders: Types.ObjectId[] = [];

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
      console.log(e);
      throw new HttpException(
        'Ошибка при создании папки',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: Types.ObjectId): Promise<FolderDocument & DeleteItems> {
    try {
      const children = await this.folderModel.find({
        parent: id,
      });

      const folder = await this.folderModel.findById(id);

      if (children.length === 0) {
        const deletedFolder: FolderDocument = await folder.delete();
        const deleteItems = {
          deleteCount: 1,
          deleteItems: [deletedFolder._id],
        };

        return Object.assign(deletedFolder, deleteItems);
      }

      await this.recDelFolders(children, folder);

      const deleteItems = {
        deleteCount: this.deleteCounter,
        deleteItems: this.deleteFolders,
      };

      this.deleteCounter = 0;
      this.deleteFolders = [];

      return Object.assign(folder, deleteItems);
    } catch (e) {
      console.log(e);
      throw new HttpException(
        'Ошибка при удалении папки',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async recDelFolders(
    childs: FolderDocument[],
    prevChild: FolderDocument,
  ): Promise<void> {
    this.deleteCounter += 1;

    for await (const child of childs) {
      const newChilds = await this.folderModel.find({
        parent: new Types.ObjectId(child._id),
      });

      this.recDelFolders(newChilds, child);

      if (newChilds.length === 0) {
        this.deleteFolders.push(child._id);
        this.deleteFolders.push(prevChild._id);

        child.delete();
        prevChild.delete();
      }
    }
  }

  async addParent(
    id: Types.ObjectId,
    parent: Types.ObjectId,
  ): Promise<FolderDocument> {
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
      throw new HttpException(
        'Ошибка при поиске дочерних папок',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeColor(
    id: Types.ObjectId,
    color: FolderColors,
  ): Promise<FolderDocument> {
    try {
      const folder = await this.findByIdAndCheck(id);

      folder.color = color;
      return folder.save();
    } catch (e) {
      throw e;
    }
  }
}
