import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { IFolderService } from 'src/core';
import { FolderColors } from 'src/types';
import { CreateFolderOptions, UpdateFolderOptions } from 'src/types/folder';

@Injectable()
export class FolderService extends IFolderService<
  FolderDocument,
  UpdateFolderOptions
> {
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
      throw new HttpException(
        'Ошибка при создании папки',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: Types.ObjectId): Promise<FolderDocument> {
    try {
      const children = await this.folderModel.find({
        parent: id,
      });

      const folder = await this.folderModel.findById(id);

      if (children.length === 0) {
        return folder.delete();
      }

      this.recDelFolders(children, folder);
      return folder;
    } catch (e) {
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
    for await (const child of childs) {
      const newChilds = await this.folderModel.find({
        parent: new Types.ObjectId(child._id),
      });

      this.recDelFolders(newChilds, child);

      if (newChilds.length === 0) {
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
