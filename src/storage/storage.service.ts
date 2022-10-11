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
  ItemsData,
  ItemDocument,
  ItemFileTypes,
  ItemTypes,
  ObjectFileServices,
  ObjectServices,
  StorageCollectionsPopulated,
  StorageItemTypes,
  StorageTransferData,
  TrackTransferData,
  UpdateStorageOptions,
} from 'src/types';
import { FolderTransferData } from 'src/types/folder';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
import { AddListenDto } from './dto/AddListen.dto';
import { ChangeAccessTypeDto } from './dto/ChangeAccessType.dto';
import { ChangeTrackFilesDto } from './dto/ChangeTrackFiles.dto';
import { ChangeIsTrashDto } from './dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from './dto/ChangeLike.dto';
import { ChangeOpenDateDto } from './dto/ChangeOpenDate.dto';
import { CreateAccessLinkDto } from './dto/CreateAccessLink.dto';
import { SearchItemDto } from './dto/SearchItem.dto';
import { Storage, StorageDocument } from './schemas/storage.schema';
import { CopyFileDto } from './dto/CopyFile.dto';
import { CreateFileDto } from 'src/file/dto/CreateFileDto';
import { FileTransferData } from 'src/types/file';
import { FileService } from 'src/file/file.service';
import { AlbumService } from 'src/album/album.service';
import { CreateAlbumDto } from 'src/album/dto/CreateAlbum.dto';
import { AlbumTransferData } from 'src/types/album';
import { AddCommentDto } from '../comment/dto/AddComment.dto';
import { CommentTransferData } from 'src/types/comment';
import { DeleteCommentDto } from 'src/comment/dto/DeleteComment.dto';

@Injectable()
export class StorageService extends IStorageService<StorageDocument, UpdateStorageOptions> {
  private readonly objectServices: ObjectServices;
  private readonly objectFileServices: ObjectFileServices;

  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<StorageDocument>,
    private readonly folderService: FolderService,
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
    private readonly albumService: AlbumService,
  ) {
    super(storageModel);

    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
    };

    this.objectFileServices = {
      [ItemFileTypes.TRACK]: trackService,
      [ItemFileTypes.FILE]: fileService,
      [ItemFileTypes.ALBUM]: albumService,
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

  async copyFile(dto: CopyFileDto): Promise<ItemDocument> {
    try {
      const { storage, item, itemType } = dtoToOjbectId(dto, ['item', 'storage']);

      const strg = await this.findByIdAndCheck(storage);

      const newItemFile = await this.objectFileServices[itemType].copy(item);

      newItemFile.items.forEach((item) => {
        const collection = getStorageCollectionName(item.type);
        strg[collection].push(item._id);
      });

      strg.usedSpace += newItemFile.size;

      await strg.save();
      return newItemFile;
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
        storage: dto.storage,
        item: folder._id,
        itemType: folder.type,
      });

      return new FolderTransferData(folder);
    } catch (e) {
      throw e;
    }
  }

  async createAlbum(dto: CreateAlbumDto, image: Express.Multer.File): Promise<AlbumTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['user', 'parent', 'storage']);

      const album = await this.albumService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image.size,
      });

      await this.addItem(
        {
          storage: correctDto.storage,
          item: album._id,
          itemType: album.type,
        },
        album.imageSize,
      );

      return new AlbumTransferData(album);
    } catch (e) {
      throw e;
    }
  }

  async createFile(dto: CreateFileDto, file: Express.Multer.File): Promise<FileTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['user', 'parent', 'storage']);

      const fileDoc = await this.fileService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        file,
        fileSize: file.size,
      });

      await this.addItem(
        {
          storage: correctDto.storage,
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

  async createTrack(
    dto: CreateTrackDto,
    audio: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['user', 'parent', 'album', 'storage']);
      const track = await this.trackService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image?.size,
        audio,
        audioSize: audio.size,
      });

      let size = audio.size;
      if (image?.size) size += image.size;

      await this.addItem(
        {
          storage: correctDto.storage,
          item: track._id,
          itemType: track.type,
        },
        size,
      );

      return new TrackTransferData(track);
    } catch (e) {
      throw e;
    }
  }

  async changeTrackFiles(
    dto: ChangeTrackFilesDto,
    audio?: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const { track, storage } = dtoToOjbectId(dto, ['track', 'storage']);
      const strg = await this.findByIdAndCheck(storage);
      const prevTrack = await this.trackService.getOneById(track);

      if (!prevTrack) throw new HttpException('Трек не найден', HttpStatus.BAD_REQUEST);

      const newTrack = await this.trackService.changeFiles(track, audio, image);
      const prevSize = prevTrack.audioSize + (prevTrack.imageSize || 0);
      const newSize = newTrack.audioSize + (newTrack.imageSize || 0);

      strg.usedSpace -= prevSize;
      strg.usedSpace += newSize;
      await strg.save();

      return new TrackTransferData(newTrack);
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

  async delete(id: Types.ObjectId): Promise<StorageDocument & ItemsData> {
    try {
      const storage = await this.findByIdAndCheck(id);

      for await (const itemType of StorageItemTypes) {
        await this.objectServices[itemType].deleteByIds(
          storage[getStorageCollectionName(itemType)],
        );
      }

      const deletedStorage = await this.storageModel.findByIdAndDelete(id);

      const itemData: ItemsData = {
        count: 1,
        items: [],
        size: storage.usedSpace,
      };

      return Object.assign(deletedStorage, itemData);
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

  async changeUsedSpace(id: Types.ObjectId, bytes: number): Promise<StorageDocument> {
    try {
      const storage = await this.findByIdAndCheck(id);
      storage.usedSpace += bytes;
      return storage.save();
    } catch (e) {
      throw e;
    }
  }

  async addItem(dto: AddDeleteItemDto, size?: number): Promise<StorageDocument> {
    try {
      const { storage, item, itemType } = dtoToOjbectId(dto, ['storage', 'item']);

      const strg = await this.findByIdAndCheck(storage);
      const collection = getStorageCollectionName(itemType);
      strg[collection].push(item);
      strg.usedSpace += size || this.objectServices[itemType].ITEM_WIEGTH;

      return strg.save();
    } catch (e) {
      throw e;
    }
  }

  async deleteItem(dto: AddDeleteItemDto): Promise<StorageDocument> {
    try {
      const { storage, item, itemType } = dtoToOjbectId(dto, ['storage', 'item']);

      const strg = await this.findByIdAndCheck(storage);
      const prevFolderCount = strg.folders.length;

      const { items, size } = await this.objectServices[itemType].delete(item);

      items.forEach((item) => {
        const collection = getStorageCollectionName(item.type);

        strg[collection] = strg[collection].filter(
          (itm) => item._id.toString() !== itm._id.toString(),
        );
      });

      strg.usedSpace -= size;
      await strg.save();

      if (prevFolderCount > strg.folders.length) {
        return await this.checkParentsAndDelete(strg._id);
      }

      return strg;
    } catch (e) {
      throw e;
    }
  }

  async checkParentsAndDelete(storage: Types.ObjectId): Promise<StorageDocument> {
    try {
      const deletedTracks: Types.ObjectId[] = [];

      let size = 0;
      const strg = await this.findByIdAndCheck(storage);

      for await (const id of strg.tracks) {
        const track = await this.trackService.getOneById(id);
        const parent = await this.trackService.getOneBy({ parent: track._id });

        if (!parent) {
          const deletedTrack = await this.trackService.delete(track._id);
          deletedTracks.push(deletedTrack._id);
          size += deletedTrack.size;
        }
      }

      const delTracks = deletedTracks.map((ids) => ids.toString());
      strg.tracks = strg.tracks.filter((itm) => !delTracks.includes(itm.toString()));

      strg.usedSpace -= size;
      return await strg.save();
    } catch (e) {
      throw new HttpException('Ошибка при проверки родителей', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchItems(dto: SearchItemDto): Promise<ItemDocument[]> {
    try {
      const { storage, text } = dtoToOjbectId(dto, ['storage']);
      let allItems: ItemDocument[] = [];
      const strg = await this.findByIdAndCheck(storage);
      const populatedStrg = await this.populateCollections(strg);

      StorageItemTypes.forEach((itemType) => {
        const collectionName = getStorageCollectionName(itemType);
        allItems = [...allItems, ...populatedStrg[collectionName]];
      });

      return allItems.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
    } catch (e) {
      throw e;
    }
  }

  async changeLike(dto: ChangeLikeDto): Promise<ItemDocument> {
    try {
      const { item, user, itemType, isLike } = dtoToOjbectId(dto, ['item', 'user']);
      return await this.objectServices[itemType].changeLike(item, user, isLike);
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

  private async populateCollections(
    storage: StorageDocument,
  ): Promise<StorageCollectionsPopulated> {
    try {
      for await (const itemType of StorageItemTypes) {
        await storage.populate<ItemDocument>(getStorageCollectionName(itemType));
      }

      return storage as any;
    } catch (e) {
      throw new HttpException('Ошибка при populateCollections', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemDocument> {
    try {
      const { item, accessType, itemType } = dtoToOjbectId(dto, ['item']);

      return await this.objectServices[itemType].changeAccessType(item, accessType);
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemDocument> {
    try {
      const { item, itemType } = dtoToOjbectId(dto, ['item']);
      return await this.objectServices[itemType].changeAccessLink(item);
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemDocument> {
    try {
      const { item, itemType, isTrash } = dtoToOjbectId(dto, ['item']);
      return await this.objectServices[itemType].changeIsTrash(item, isTrash);
    } catch (e) {
      throw e;
    }
  }

  async addListen(dto: AddListenDto): Promise<ItemDocument> {
    try {
      const { item, itemType } = dtoToOjbectId(dto, ['item']);
      return await this.objectServices[itemType].addListen(item);
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(dto: ChangeOpenDateDto): Promise<ItemDocument> {
    try {
      const { item, itemType } = dtoToOjbectId(dto, ['item']);
      return await this.objectServices[itemType].changeOpenDate(item);
    } catch (e) {
      throw e;
    }
  }

  async createComment(dto: AddCommentDto): Promise<CommentTransferData> {
    try {
      const { item, itemType, user, answer } = dtoToOjbectId(dto, ['item', 'user', 'answer']);

      const comment = await this.objectServices[itemType].addComment(item, {
        title: dto.title,
        text: dto.text,
        answer,
        user,
      });

      return new CommentTransferData(comment);
    } catch (e) {
      throw e;
    }
  }

  async deleteComment(dto: DeleteCommentDto): Promise<any> {
    try {
      const { item, itemType, comment } = dtoToOjbectId(dto, ['item', 'comment']);

      const delComment = await this.objectServices[itemType].deleteComment(item, comment);

      return delComment;
    } catch (e) {
      throw e;
    }
  }
}
