import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DefaultService } from 'src/core';
import { StorageTransferData } from 'src/transfer';
import { Storage, StorageDocument } from './schemas/storage.schema';
import { AddItemDto } from './dto/add-item.dto';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import {
  ICreateStorageOptions,
  ItemDocument,
  StorageCollectionsPopulated,
  StorageItemTypes,
  IUpdateStorageOptions,
  IStorageService,
} from 'src/types';

@Injectable()
export class StorageService
  extends DefaultService<StorageDocument, IUpdateStorageOptions>
  implements IStorageService<StorageDocument>
{
  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<StorageDocument>,
  ) {
    super(storageModel);
  }

  async getStorage(user: Types.ObjectId): Promise<StorageTransferData> {
    try {
      const storage = await this.findOneByAndCheck({ user });
      const populatedStorage = await this.populateCollections(storage);
      return new StorageTransferData(populatedStorage);
    } catch (e) {
      throw e;
    }
  }

  async create(options: ICreateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.storageModel.findOne({ user: options.user });

      if (storage) {
        throw new HttpException(
          'Хранилище c таким пользователем уже существует',
          HttpStatus.CONFLICT,
        );
      }

      return await this.storageModel.create({
        ...options,
        changeDate: Date.now(),
        createDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(id: Types.ObjectId): Promise<StorageDocument> {
    try {
      const storage = await this.findByIdAndCheck(id);

      // ! Think
      // for await (const itemType of StorageItemTypes) {
      //   await this.objectServices[itemType].deleteByIds(
      //     storage[getStorageCollectionName(itemType)],
      //   );
      // }

      return await this.storageModel.findByIdAndDelete(id);
    } catch (e) {
      throw e;
    }
  }

  async changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<StorageDocument> {
    try {
      const storage = await this.findByIdAndCheck(id);
      storage.diskSpace = bytes;
      return await storage.save();
    } catch (e) {
      throw e;
    }
  }

  async addUsedSpace(id: Types.ObjectId, bytes: number): Promise<StorageDocument> {
    try {
      const storage = await this.findByIdAndCheck(id);
      storage.usedSpace += bytes;
      return storage.save();
    } catch (e) {
      throw e;
    }
  }

  async addItem(dto: AddItemDto, size: number): Promise<StorageDocument> {
    try {
      const { storage, item, itemType } = dtoToOjbectId(dto, ['storage', 'item']);

      const strg = await this.findByIdAndCheck(storage);
      const collection = getStorageCollectionName(itemType);
      strg[collection].push(item);
      // strg.usedSpace += size || this.objectServices[itemType].ITEM_WIEGTH;
      strg.usedSpace += size;

      return strg.save();
    } catch (e) {
      throw e;
    }
  }

  // ! think в items service
  // async searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
  //   try {
  //     const { text } = dto;
  //     let allItems: ItemDocument[] = [];

  //     const strg = await this.findOneByAndCheck({ user });
  //     const populatedStrg = await this.populateCollections(strg);

  //     StorageItemTypes.forEach((itemType) => {
  //       const collectionName = getStorageCollectionName(itemType);
  //       allItems = [...allItems, ...populatedStrg[collectionName]];
  //     });

  //     const itemDocs = allItems.filter((item) =>
  //       item.name.toLowerCase().includes(text.toLowerCase()),
  //     );

  //     return itemDocs.map((item) => ItemTDataFactory.create(item));
  //   } catch (e) {
  //     throw e;
  //   }
  // }

  // ! think
  async getOneBy(options: IUpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck(options);
      await storage.populate('folders');
      await storage.populate('files');
      await storage.populate('tracks');
      await storage.populate('videos');
      return await storage.populate('iamges');
    } catch (e) {
      throw e;
    }
  }

  async changeUsedSpace(user: Types.ObjectId, prevSize, newSize): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck({ user });

      storage.usedSpace -= prevSize;
      storage.usedSpace += newSize;
      return await storage.save();
    } catch (e) {
      throw e;
    }
  }

  async populateCollections(storage: StorageDocument): Promise<StorageCollectionsPopulated> {
    try {
      for await (const itemType of StorageItemTypes) {
        await storage.populate<ItemDocument>(getStorageCollectionName(itemType));
      }

      return storage as any;
    } catch (e) {
      throw new HttpException('Ошибка при populateCollections', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
