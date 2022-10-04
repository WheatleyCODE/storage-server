import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IStorageService } from 'src/core';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { FolderService } from 'src/folder/folder.service';
import {
  CreateStorageOptions,
  DeleteItems,
  ItemTypes,
  ObjectServices,
  StorageTransferData,
  UpdateStorageOptions,
} from 'src/types';
import { FolderTransferData } from 'src/types/folder';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
import { SearchItemDto } from './dto/SearchItem.dto';
import { Storage, StorageDocument } from './schemas/storage.schema';

@Injectable()
export class StorageService extends IStorageService<
  StorageDocument,
  UpdateStorageOptions
> {
  private readonly objectServices: ObjectServices;
  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<StorageDocument>,
    private readonly folderService: FolderService,
  ) {
    super(storageModel);

    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
    };
  }

  async getStorage(user: Types.ObjectId): Promise<StorageTransferData> {
    try {
      const storage = await this.getOneByAndCheck({ user });
      return new StorageTransferData(storage);
    } catch (e) {
      throw e;
    }
  }

  async createFolder(dto: CreateFolderDto): Promise<FolderTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['storage', 'user', 'parent']);
      const folder = await this.folderService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
      });

      await this.addItem({
        id: dto.storage,
        item: folder._id,
        itemType: folder.type,
      });

      return new FolderTransferData(folder);
    } catch (e) {
      throw e;
    }
  }

  async create(options: CreateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.storageModel.findOne({ user: options.user });

      if (storage) {
        throw new HttpException(
          'Хранилище c таким пользователем уже существует',
          HttpStatus.CONFLICT,
        );
      }

      return await this.storageModel.create({ ...options });
    } catch (e) {
      throw e;
    }
  }

  delete(id: Types.ObjectId): Promise<StorageDocument & DeleteItems> {
    throw new Error('Method not implemented.');
  }

  async changeDiskSpace(
    id: Types.ObjectId,
    bytes: number,
  ): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async changeUsedSpace(
    id: Types.ObjectId,
    bytes: number,
  ): Promise<StorageDocument> {
    try {
      const storage = await this.findByIdAndCheck(id);
      storage.usedSpace += bytes;
      return storage.save();
    } catch (e) {
      throw e;
    }
  }

  async addItem(dto: AddDeleteItemDto): Promise<StorageDocument> {
    try {
      const { id, item, itemType } = dtoToOjbectId(dto, ['id', 'item']);

      const storage = await this.findByIdAndCheck(id);
      const collection = getStorageCollectionName(itemType);
      storage[collection].push(item);
      storage.usedSpace += this.objectServices[itemType].ITEM_WIEGTH;
      return storage.save();
    } catch (e) {
      throw e;
    }
  }

  async deleteItem(dto: AddDeleteItemDto): Promise<StorageDocument> {
    try {
      const { id, item, itemType } = dtoToOjbectId(dto, ['id', 'item']);

      const storage = await this.findByIdAndCheck(id);
      const collection = getStorageCollectionName(itemType);

      const delFolder = await this.objectServices[itemType].delete(item);
      const { deleteCount, deleteItems } = delFolder;

      const delItems = deleteItems.map((ids) => ids.toString());

      storage[collection] = storage[collection].filter(
        (itm) => !delItems.includes(itm.toString()),
      );

      // eslint-disable-next-line prettier/prettier
      storage.usedSpace -= deleteCount * this.objectServices[itemType].ITEM_WIEGTH;
      return await storage.save();
    } catch (e) {
      throw e;
    }
  }

  async searchItems(dto: SearchItemDto): Promise<StorageDocument[]> {
    throw new Error('Method not implemented.');
  }

  async getOneBy(options: UpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.getOneByAndCheck(options);
      return await storage.populate('folders');
    } catch (e) {
      throw e;
    }
  }
}
