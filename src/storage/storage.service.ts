import { HttpException, HttpStatus, Injectable, StreamableFile } from '@nestjs/common';
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
  UpdateStorageOptions,
  ItemTransferData,
  AccessTypes,
  ChildrensTransferData,
  ItemDto,
  ItemFileDto,
} from 'src/types';
import {
  FolderTransferData,
  StorageTransferData,
  TrackTransferData,
  FileTransferData,
  AlbumTransferData,
  CommentTransferData,
  ItemTDataFactory,
  VideoTransferData,
} from 'src/transfer';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import { AddItemDto } from './dto/AddItem.dto';
import { DeleteItemDto } from './dto/DeleteItem.dto';
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
import { FileService } from 'src/file/file.service';
import { AlbumService } from 'src/album/album.service';
import { CreateAlbumDto } from 'src/album/dto/CreateAlbum.dto';
import { AddCommentDto } from 'src/comment/dto/AddComment.dto';
import { DeleteCommentDto } from 'src/comment/dto/DeleteComment.dto';
import { ChangeColorDto } from './dto/ChangeColor.dto';
import { FolderDocument } from 'src/folder/schemas/folder.schema';
import { ChangeNameDto } from './dto/ChangeName.dto';
import { ChangeParentDto } from './dto/ChangeParent.dto';
import { ImageService } from 'src/image/image.service';
import { ImageTransferData } from 'src/transfer/ImageTransferData';
import { CreateImageDto } from 'src/image/dto/CreateImage.dto';
import { UploadFilesDto } from './dto/UploadFiles.dto';
import { VideoService } from 'src/video/video.service';
import { CreateVideoDto } from 'src/video/dto/CreateVideo.dto';

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
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
  ) {
    super(storageModel);

    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };

    this.objectFileServices = {
      [ItemFileTypes.TRACK]: trackService,
      [ItemFileTypes.FILE]: fileService,
      [ItemFileTypes.ALBUM]: albumService,
      [ItemFileTypes.IMAGE]: imageService,
      [ItemFileTypes.VIDEO]: videoService,
    };
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

  async copyFile(dto: CopyFileDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));
      const strg = await this.findOneByAndCheck({ user });
      const newItemFiles: ItemDocument[] = [];

      for await (const { type, id } of items) {
        const newItemFile = await this.objectFileServices[type].copy(id);

        newItemFile.items.forEach((item) => {
          const collection = getStorageCollectionName(item.type);
          strg[collection].push(item._id);
        });

        strg.usedSpace += newItemFile.size;
        newItemFiles.push(newItemFile);
      }

      await strg.save();
      return newItemFiles.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  async createFolder(dto: CreateFolderDto, user: Types.ObjectId): Promise<FolderTransferData> {
    try {
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const folder = await this.folderService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        user,
      });

      const stor = await this.storageModel.findOne({ user });

      await this.addItem({
        storage: stor._id,
        item: folder._id,
        itemType: folder.type,
      });

      return new FolderTransferData(folder);
    } catch (e) {
      throw e;
    }
  }

  async createAlbum(
    dto: CreateAlbumDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<AlbumTransferData> {
    try {
      const storage = await this.findOneByAndCheck({ user });

      const correctDto = dtoToOjbectId(dto, ['parent']);

      const album = await this.albumService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image.size,
        user,
      });

      await this.addItem(
        {
          storage: storage._id,
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

  async createFile(
    dto: CreateFileDto,
    user: Types.ObjectId,
    file: Express.Multer.File,
  ): Promise<FileTransferData> {
    try {
      const strg = await this.findOneByAndCheck({ user });
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const fileDoc = await this.fileService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        file,
        fileSize: file.size,
        user,
      });

      await this.addItem(
        {
          storage: strg._id,
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

  async createImage(
    dto: CreateImageDto,
    user: Types.ObjectId,
    image: Express.Multer.File,
  ): Promise<ImageTransferData> {
    try {
      const strg = await this.findOneByAndCheck({ user });
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const imageDoc = await this.imageService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image.size,
        user,
      });

      await this.addItem(
        {
          storage: strg._id,
          item: imageDoc._id,
          itemType: imageDoc.type,
        },
        imageDoc.imageSize,
      );

      return new ImageTransferData(imageDoc);
    } catch (e) {
      throw e;
    }
  }

  async createTrack(
    dto: CreateTrackDto,
    user: Types.ObjectId,
    audio: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<TrackTransferData> {
    try {
      const storage = await this.findOneByAndCheck({ user });
      const correctDto = dtoToOjbectId(dto, ['parent', 'album']);

      const track = await this.trackService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image?.size,
        audio,
        audioSize: audio.size,
        user,
      });

      let size = audio.size;
      if (image?.size) size += image.size;

      await this.addItem(
        {
          storage: storage._id,
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

  // !dsadasda
  async createVideo(
    dto: CreateVideoDto,
    user: Types.ObjectId,
    video: Express.Multer.File,
    image?: Express.Multer.File,
  ): Promise<VideoTransferData> {
    try {
      const storage = await this.findOneByAndCheck({ user });
      const correctDto = dtoToOjbectId(dto, ['parent']);

      const videoDoc = await this.videoService.create({
        ...correctDto,
        creationDate: Date.now(),
        openDate: Date.now(),
        image,
        imageSize: image?.size,
        video,
        videoSize: video.size,
        user,
      });

      let size = video.size;
      if (image?.size) size += image.size;

      await this.addItem(
        {
          storage: storage._id,
          item: videoDoc._id,
          itemType: videoDoc.type,
        },
        size,
      );

      return new VideoTransferData(videoDoc);
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

  async addItem(dto: AddItemDto, size?: number): Promise<StorageDocument> {
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

  async deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData> {
    try {
      const itemsDto = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      let itemsDocs: ItemDocument[] = [];
      let sumSize = 0;

      const strg = await this.findOneByAndCheck({ user });
      // const prevFolderCount = strg.folders.length;

      for await (const { type, id } of itemsDto) {
        const { items, size } = await this.objectServices[type].delete(id);
        itemsDocs = [...itemsDocs, ...items];
        sumSize += size;
      }

      itemsDocs.forEach((item) => {
        const collection = getStorageCollectionName(item.type);

        strg[collection] = strg[collection].filter(
          (itm) => item._id.toString() !== itm._id.toString(),
        );
      });

      strg.usedSpace -= sumSize;
      await strg.save();

      // if (prevFolderCount > strg.folders.length) {
      //   const stor = await this.checkParentsAndDelete(strg._id);
      //   const populatedStrg = await this.populateCollections(stor);
      //   return new StorageTransferData(populatedStrg);
      // }

      const populatedStrg = await this.populateCollections(strg);
      return new StorageTransferData(populatedStrg);
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
      throw new HttpException('Ошибка при проверке родителей', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const { text } = dto;
      let allItems: ItemDocument[] = [];

      const strg = await this.findOneByAndCheck({ user });
      const populatedStrg = await this.populateCollections(strg);

      StorageItemTypes.forEach((itemType) => {
        const collectionName = getStorageCollectionName(itemType);
        allItems = [...allItems, ...populatedStrg[collectionName]];
      });

      const itemDocs = allItems.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );

      return itemDocs.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  async changeLike(dto: ChangeLikeDto): Promise<ItemTransferData> {
    try {
      const { item, user, itemType, isLike } = dtoToOjbectId(dto, ['item', 'user']);
      const itemDoc = await this.objectServices[itemType].changeLike(item, user, isLike);
      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeColor(dto: ChangeColorDto): Promise<FolderTransferData[]> {
    try {
      const { color } = dto;
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      const folderDocs: FolderDocument[] = [];

      for await (const { id } of items) {
        const folderDoc = await this.folderService.changeColor(id, color);
        folderDocs.push(folderDoc);
      }

      return folderDocs.map((doc) => new FolderTransferData(doc));
    } catch (e) {
      throw e;
    }
  }

  async getOneBy(options: UpdateStorageOptions): Promise<StorageDocument> {
    try {
      const storage = await this.findOneByAndCheck(options);
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

  async changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData> {
    try {
      const { id, accessType, type } = dtoToOjbectId(dto, ['id']);

      const itemDoc = await this.objectServices[type].changeAccessType(id, accessType);

      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData> {
    try {
      const { id, type } = dtoToOjbectId(dto, ['id']);
      const itemDoc = await this.objectServices[type].changeAccessLink(id);
      itemDoc.accessType = AccessTypes.LINK;
      await itemDoc.save();
      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]> {
    try {
      const itemDocs: ItemDocument[] = [];

      const { isTrash } = dto;
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { id, type } of items) {
        const itemDoc = await this.objectServices[type].changeIsTrash(id, isTrash);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  async changeName(dto: ChangeNameDto): Promise<ItemTransferData> {
    try {
      const { id, name, type } = dtoToOjbectId(dto, ['id']);

      const itemDoc = await this.objectServices[type].changeName(id, name);

      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeParent(dto: ChangeParentDto): Promise<ItemTransferData[]> {
    try {
      const itemDocs: ItemDocument[] = [];
      const { parent } = dtoToOjbectId(dto, ['parent']);
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { id, type } of items) {
        const itemDoc = await this.objectServices[type].changeParent(id, parent);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  async getChildrens(id: Types.ObjectId): Promise<ChildrensTransferData> {
    try {
      let itemDocs: ItemDocument[] = [];

      for await (const type of StorageItemTypes) {
        const itemDoc = await this.objectServices[type].getChildrens(id);
        itemDocs = [...itemDocs, ...itemDoc];
      }

      const parentDocs = await this.folderService.getParents(id);

      const childrens = itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
      const parents = parentDocs.map((parentDoc) => new FolderTransferData(parentDoc));

      return {
        parents,
        childrens,
      };
    } catch (e) {
      throw e;
    }
  }

  async addListen(dto: AddListenDto): Promise<ItemTransferData> {
    try {
      const { item, itemType } = dtoToOjbectId(dto, ['item']);
      const itemDoc = await this.objectServices[itemType].addListen(item);
      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async uploadFiles(
    dto: UploadFilesDto,
    user: Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<ItemTransferData[]> {
    try {
      const { parent } = dto;
      await this.findOneByAndCheck({ user });

      const object = {
        image: ['jpg', 'png'],
        audio: ['mp3'],
        video: ['mp4'],
      };

      const itemsTransferData: ItemTransferData[] = [];

      for await (const file of files) {
        const filename = file.originalname.split('.');

        if (object.audio.includes(filename[filename.length - 1])) {
          const track = await this.createTrack(
            {
              name: filename[0],
              author: 'Не понятно',
              text: 'Без текста',
              parent,
              album: undefined,
            },
            user,
            file,
          );
          itemsTransferData.push(track);
          continue;
        }

        if (object.image.includes(filename[filename.length - 1])) {
          const image = await this.createImage(
            {
              name: filename[0],
              parent,
            },
            user,
            file,
          );
          itemsTransferData.push(image);
          continue;
        }

        if (object.video.includes(filename[filename.length - 1])) {
          const image = await this.createVideo(
            {
              name: filename[0],
              parent,
              description: 'Без описания',
            },
            user,
            file,
          );
          itemsTransferData.push(image);
          continue;
        }

        const fileTD = await this.createFile({ name: filename[0], parent }, user, file);
        itemsTransferData.push(fileTD);
      }

      return itemsTransferData;
    } catch (e) {
      throw e;
    }
  }

  async changeOpenDate(dto: ChangeOpenDateDto): Promise<ItemTransferData> {
    try {
      const { item, itemType } = dtoToOjbectId(dto, ['item']);
      const itemDoc = await this.objectServices[itemType].changeOpenDate(item);
      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async downloadFile(dto: ItemFileDto): Promise<{ file: StreamableFile; filename: string }> {
    try {
      const { id, type } = dtoToOjbectId(dto, ['id']);
      const { file, filename } = await this.objectFileServices[type].download(id);
      return { file: new StreamableFile(file), filename };
    } catch (e) {
      throw e;
    }
  }

  async downloadArchive(dto: ItemFileDto[]): Promise<{ path: string; name: string }[]> {
    try {
      const pathArr: { path: string; name: string }[] = [];
      const items = dto.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { id, type } of items) {
        const { path, filename } = await this.objectFileServices[type].getFilePath(id);
        pathArr.push({ path, name: filename });
      }

      return pathArr;
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
