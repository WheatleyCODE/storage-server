import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DefaultService } from 'src/core';
import { StorageTransferData } from 'src/transfer';
import { Storage, StorageDocument } from './schemas/storage.schema';
import { AddItemDto } from './dto/add-item.dto';
import { dtoToOjbectId, getStorageCollectionName, isObjectId } from 'src/utils';
import {
  ICreateStorageOptions,
  ItemDocument,
  StorageCollectionsPopulated,
  StorageItemTypes,
  IUpdateStorageOptions,
  IStorageService,
} from 'src/types';
import { AlbumDocument } from 'src/album/schemas/album.schema';
import { ChangeSettingsDto } from './dto/change-settings.dto';

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

  async changeSettings(dto: ChangeSettingsDto, user: Types.ObjectId): Promise<StorageTransferData> {
    try {
      const { isRecommend, isTools } = dto;
      const storage = await this.findOneByAndCheck({ user });
      storage.isRecommend = isRecommend;
      storage.isTools = isTools;
      await storage.save();
      const populatedStorage = await this.populateCollections(storage);
      return new StorageTransferData(populatedStorage);
    } catch (e) {
      throw e;
    }
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

  async deleteCollectionItems(
    strg: Types.ObjectId | StorageDocument,
    deleteItems: ItemDocument[],
  ): Promise<StorageDocument> {
    let storage = strg as StorageDocument;

    if (isObjectId(strg)) {
      storage = await this.getOneByIdAndCheck(strg as Types.ObjectId);
    }

    deleteItems.forEach((item) => {
      const collection = getStorageCollectionName(item.type);

      storage[collection] = storage[collection].filter(
        (itm) => item._id.toString() !== itm._id.toString(),
      );
    });

    return await storage.save();
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

  async addUsedSpace(
    strg: Types.ObjectId | StorageDocument,
    bytes: number,
  ): Promise<StorageDocument> {
    try {
      let storage = strg as StorageDocument;

      if (isObjectId(strg)) {
        storage = await this.getOneByIdAndCheck(strg as Types.ObjectId);
      }

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
      strg.usedSpace += size;

      return strg.save();
    } catch (e) {
      throw e;
    }
  }

  // ! think
  async getOneByAndPopulate(options: IUpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck(options);
      await storage.populate('folders');
      await storage.populate('files');
      await storage.populate('tracks');
      await storage.populate('videos');
      await storage.populate('images');
      return storage;
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

      const albums = storage.albums as unknown as AlbumDocument[];

      for await (const album of albums) {
        await album.populate('tracks');
      }

      return storage as any;
    } catch (e) {
      throw new HttpException('Ошибка при populateCollections', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeLiked(
    user: Types.ObjectId,
    item: Types.ObjectId,
    isAdd: boolean,
  ): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck({ user });

      let liked = [...storage.likedItems];
      const index = liked.findIndex((id) => id.toString() === item.toString());

      if (index === -1 && isAdd) {
        liked.push(item);
      }

      if (index !== -1 && !isAdd) {
        liked = liked.filter((id) => id.toString() !== item.toString());
      }

      storage.likedItems = liked;

      return await storage.save();
    } catch (e) {
      throw e;
    }
  }

  async changeStared(
    user: Types.ObjectId,
    item: Types.ObjectId,
    isAdd: boolean,
  ): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck({ user });

      let stared = [...storage.staredItems];
      const index = stared.findIndex((id) => id.toString() === item.toString());

      if (index === -1 && isAdd) {
        stared.push(item);
      }

      if (index !== -1 && !isAdd) {
        stared = stared.filter((id) => id.toString() !== item.toString());
      }

      storage.staredItems = stared;

      await storage.save();
      return storage;
    } catch (e) {
      throw e;
    }
  }
}
