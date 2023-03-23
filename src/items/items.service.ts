import { stringToOjbectId } from './../utils/object-id.utils';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { ChangeIsTrashDto } from 'src/items/dto/change-is-trash.dto';
import { CopyItemDto } from 'src/items/dto/copy-item.dto';
import { CreateAccessLinkDto } from 'src/items/dto/create-access-link.dto';
import { DeleteItemDto } from 'src/items/dto/delete-item.dto';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { FolderTransferData, ItemTDataFactory, StorageTransferData } from 'src/transfer';
import {
  addListen,
  changeDate,
  delFildsByObj,
  dtoToOjbectId,
  getStorageCollectionName,
} from 'src/utils';
import { VideoService } from 'src/video/video.service';
import {
  AccessTypes,
  ChildrensTransferData,
  IItemsService,
  ItemDocument,
  ItemTransferData,
  ItemTypes,
  ObjectServices,
  StorageItemTypes,
} from 'src/types';
import { ChangeParentDto } from 'src/items/dto/change-parent.dto';
import { ChangeNameDto } from './dto/change-name.dto';
import { ChangeAccessTypeDto } from './dto/change-access-type.dto';
import { ChangeLikeDto } from './dto/change-like.dto';
import { AddListenDto } from './dto/add-listen.dto';
import { ChangeStarDto } from './dto/change-star.dto';
import { collectionTypes, storageCollectionNames } from 'src/consts/storage.consts';
import { RestoreItemsDto } from './dto/restore-items.dto';

@Injectable()
export class ItemsService implements IItemsService {
  private readonly objectServices: ObjectServices;

  constructor(
    private readonly storageService: StorageService,
    private readonly folderService: FolderService,
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
    private readonly albumService: AlbumService,
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
  ) {
    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };
  }

  async deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData> {
    try {
      const itemsDto = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      let deleteItems: ItemDocument[] = [];
      let sumSize = 0;

      let storage = await this.storageService.getOneByAndCheck({ user });

      for await (const { type, id } of itemsDto) {
        const { items, size } = await this.objectServices[type].delete(id);
        deleteItems = [...deleteItems, ...items];
        sumSize += size;
      }

      const delFolders: string[] = [...deleteItems]
        .filter((item) => item.type === ItemTypes.FOLDER)
        .map((item) => item._id.toString());

      for await (const name of storageCollectionNames) {
        const type = collectionTypes[name];
        const ids = storage[name];

        const items = await this.objectServices[type].getAllByIds(ids);

        for await (const item of items) {
          const parentId = item?.parent;
          const id = item._id;

          if (parentId && delFolders.includes(parentId.toString())) {
            const { size, items } = await this.objectServices[type].delete(id);
            deleteItems = [...deleteItems, ...items];
            sumSize += size;
          }
        }
      }

      storage = await this.storageService.deleteCollectionItems(storage, deleteItems);
      storage = await this.storageService.addUsedSpace(storage, -sumSize);

      const populatedStorage = await this.storageService.populateCollections(storage);
      return new StorageTransferData(populatedStorage);
    } catch (e) {
      throw e;
    }
  }

  async restoreItems(dto: RestoreItemsDto): Promise<ItemTransferData[]> {
    try {
      console.log(dto);

      const itemsTD = dto.items.map((item) => dtoToOjbectId(item, ['id']));
      const itemDocs: ItemDocument[] = [];

      for await (const item of itemsTD) {
        const id = stringToOjbectId(item.id);

        const obj = delFildsByObj<
          ItemTransferData,
          | 'changeDate'
          | 'comments'
          | 'createDate'
          | 'openDate'
          | 'user'
          | 'listenCount'
          | 'likeCount'
          | 'likedUsers'
          | 'starredCount'
        >(item, [
          'changeDate',
          'comments',
          'createDate',
          'openDate',
          'user',
          'listenCount',
          'likeCount',
          'likedUsers',
          'starredCount',
        ]);

        const updateItem = { ...obj, _id: id };

        const itemDoc = await this.objectServices[item.type].restore(id, updateItem);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  async changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData[]> {
    try {
      const itemsDocs: ItemDocument[] = [];
      const itemsDto = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { type, id } of itemsDto) {
        let itemDoc = await this.objectServices[type].changeAccessType(id, dto.accessType);
        itemDoc = await changeDate(itemDoc, ['changeDate']);
        itemsDocs.push(itemDoc);
      }

      return itemsDocs.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  async changeName(dto: ChangeNameDto): Promise<ItemTransferData> {
    try {
      const { id, name, type } = dtoToOjbectId(dto, ['id']);

      let itemDoc = await this.objectServices[type].changeName(id, name);
      itemDoc = await changeDate(itemDoc, ['changeDate']);

      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData> {
    try {
      const { id, type } = dtoToOjbectId(dto, ['id']);
      let itemDoc = await this.objectServices[type].changeAccessLink(id);
      itemDoc.accessType = AccessTypes.LINK;
      await itemDoc.save();

      itemDoc = await changeDate(itemDoc, ['changeDate']);
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
        let itemDoc = await this.objectServices[type].changeIsTrash(id, isTrash);
        itemDoc = await changeDate(itemDoc, ['changeDate']);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  async changeLike(dto: ChangeLikeDto): Promise<ItemTransferData> {
    try {
      const { id, user, type, isLike } = dtoToOjbectId(dto, ['id', 'user']);
      await this.objectServices[type].getOneByIdAndCheck(id);
      await this.storageService.changeLiked(user, id, isLike);

      let itemDoc = await this.objectServices[type].changeLike(id, user, isLike);
      itemDoc = await changeDate(itemDoc, ['changeDate']);

      return ItemTDataFactory.create(itemDoc);
    } catch (e) {
      throw e;
    }
  }

  async changeStar(dto: ChangeStarDto): Promise<ItemTransferData[]> {
    try {
      const { user, isStar } = dtoToOjbectId(dto, ['user']);
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));
      const itemDocs: ItemDocument[] = [];

      for await (const { id, type } of items) {
        await this.objectServices[type].getOneByIdAndCheck(id);
        await this.storageService.changeStared(user, id, isStar);
        let itemDoc = await this.objectServices[type].changeStar(id, isStar);
        itemDoc = await changeDate(itemDoc, ['changeDate']);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  async getChildrens(id: Types.ObjectId): Promise<ChildrensTransferData> {
    try {
      const folder = await this.folderService.getOneByIdAndCheck(id);
      await changeDate(folder, ['openDate']);
      await addListen(folder);

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
      const { id, type } = dtoToOjbectId(dto, ['id']);
      const itemDoc = await this.objectServices[type].addListen(id);
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
        let itemDoc = await this.objectServices[type].changeParent(id, parent);
        itemDoc = await changeDate(itemDoc, ['changeDate']);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  async copyItem(dto: CopyItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));
      const strg = await this.storageService.getOneByAndCheck({ user });

      const newItems: ItemDocument[] = [];

      for await (const { type, id } of items) {
        const newItemFile = await this.objectServices[type].copy(id);

        newItemFile.items.forEach((item) => {
          const collection = getStorageCollectionName(item.type);
          strg[collection].push(item._id);
        });

        strg.usedSpace += newItemFile.size;
        newItems.push(newItemFile);
      }

      await strg.save();
      return newItems.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }
}
