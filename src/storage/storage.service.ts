import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IStorageService } from 'src/core';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { FolderService } from 'src/folder/folder.service';
import { CreateTrackDto } from 'src/track/dto/createTrackDto';
import { TrackService } from 'src/track/track.service';
import {
  CreateStorageOptions,
  DeleteItems,
  ItemDocument,
  ItemTypes,
  ObjectServices,
  StorageTransferData,
  TrackTransferData,
  UpdateStorageOptions,
} from 'src/types';
import { FolderTransferData } from 'src/types/folder';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
import { AddListenDto } from './dto/AddListen.dto';
import { ChangeAccessTypeDto } from './dto/ChangeAccessType.dto';
import { ChangeIsTrashDto } from './dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from './dto/ChangeLike.dto';
import { ChangeOpenDateDto } from './dto/ChangeOpenDate.dto';
import { CreateAccessLinkDto } from './dto/CreateAccessLink.dto';
import { SearchItemDto } from './dto/SearchItem.dto';
import { Storage, StorageDocument } from './schemas/storage.schema';

@Injectable()
export class StorageService extends IStorageService<StorageDocument, UpdateStorageOptions> {
  private readonly objectServices: ObjectServices;
  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<StorageDocument>,
    private readonly folderService: FolderService,
    private readonly trackService: TrackService,
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

  async createTrack(
    dto: CreateTrackDto,
    image: Express.Multer.File,
    audio: Express.Multer.File,
  ): Promise<any> {
    try {
      const correctDto = dtoToOjbectId(dto, ['user', 'parent', 'album']);
      const track = await this.trackService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        audio,
      });

      await this.addItem({
        id: dto.storage,
        item: track._id,
        itemType: track.type,
      });

      return new TrackTransferData(track);
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

  async delete(id: Types.ObjectId): Promise<StorageDocument & DeleteItems> {
    throw new Error('Method not implemented.');
  }

  async changeDiskSpace(id: Types.ObjectId, bytes: number): Promise<StorageDocument> {
    throw new Error('Method not implemented.');
  }

  async changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<StorageDocument> {
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

      storage[collection] = storage[collection].filter((itm) => !delItems.includes(itm.toString()));

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

  async changeLike(dto: ChangeLikeDto): Promise<ItemDocument> {
    try {
      const { id, user, itemType, isLike } = dtoToOjbectId(dto, ['id', 'user']);
      return await this.objectServices[itemType].changeLike(id, user, isLike);
    } catch (e) {
      throw e;
    }
  }

  async getOneBy(options: UpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.getOneByAndCheck(options);
      return await storage.populate('folders');
    } catch (e) {
      throw e;
    }
  }

  async changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemDocument> {
    try {
      const { id, accessType, itemType } = dtoToOjbectId(dto, ['id']);

      return await this.objectServices[itemType].changeAccessType(id, accessType);
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemDocument> {
    try {
      const { id, itemType } = dtoToOjbectId(dto, ['id']);
      return await this.objectServices[itemType].changeAccessLink(id);
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemDocument> {
    try {
      const { id, itemType, isTrash } = dtoToOjbectId(dto, ['id']);
      return await this.objectServices[itemType].changeIsTrash(id, isTrash);
    } catch (e) {
      throw e;
    }
  }

  async addListen(dto: AddListenDto): Promise<ItemDocument> {
    try {
      const { id, itemType } = dtoToOjbectId(dto, ['id']);
      return await this.objectServices[itemType].addListen(id);
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(dto: ChangeOpenDateDto): Promise<ItemDocument> {
    try {
      const { id, itemType } = dtoToOjbectId(dto, ['id']);
      return await this.objectServices[itemType].changeOpenDate(id);
    } catch (e) {
      throw e;
    }
  }
}
