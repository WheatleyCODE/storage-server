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
import { SearchItemDto } from 'src/storage/dto/search-item.dto';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { FolderTransferData, ItemTDataFactory } from 'src/transfer';
import { dtoToOjbectId, getStorageCollectionName } from 'src/utils';
import { VideoService } from 'src/video/video.service';
import {
  AccessTypes,
  ChildrensTransferData,
  DateFilds,
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

  async deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const itemsDto = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      let deleteItems: ItemDocument[] = [];
      let sumSize = 0;

      const strg = await this.storageService.getOneBy({ user });

      if (!strg) {
        throw new HttpException('Хранилище не найдено', HttpStatus.BAD_REQUEST);
      }

      // const prevFolderCount = strg.folders.length;

      for await (const { type, id } of itemsDto) {
        const { items, size } = await this.objectServices[type].delete(id);
        deleteItems = [...deleteItems, ...items];
        sumSize += size;
      }

      deleteItems.forEach((item) => {
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

      // const populatedStrg = await this.storageService.populateCollections(strg);
      return deleteItems.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }

  async changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData[]> {
    try {
      const itemsDocs: ItemDocument[] = [];
      const itemsDto = dto.items.map((item) => dtoToOjbectId(item, ['id']));

      for await (const { type, id } of itemsDto) {
        let itemDoc = await this.objectServices[type].changeAccessType(id, dto.accessType);
        itemDoc = await this.changeDate(itemDoc, ['changeDate']);
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
      itemDoc = await this.changeDate(itemDoc, ['changeDate']);

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

      itemDoc = await this.changeDate(itemDoc, ['changeDate']);
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
        itemDoc = await this.changeDate(itemDoc, ['changeDate']);
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
      const doc = await this.objectServices[type].getOneById(id);

      if (!doc) {
        throw new HttpException('Элемент не найден', HttpStatus.BAD_REQUEST);
      }

      let itemDoc = await this.objectServices[type].changeLike(id, user, isLike);
      itemDoc = await this.changeDate(itemDoc, ['changeDate']);

      return ItemTDataFactory.create(itemDoc);
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
        itemDoc = await this.changeDate(itemDoc, ['changeDate']);
        itemDocs.push(itemDoc);
      }

      return itemDocs.map((itemDoc) => ItemTDataFactory.create(itemDoc));
    } catch (e) {
      throw e;
    }
  }

  private async changeDate(itemDoc: ItemDocument, dateFild: DateFilds[]): Promise<ItemDocument> {
    try {
      dateFild.forEach((fild) => (itemDoc[fild] = Date.now()));
      return itemDoc.save();
    } catch (e) {
      throw new HttpException('Ошибка при измении даты открытия', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async copyItem(dto: CopyItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const items = dto.items.map((item) => dtoToOjbectId(item, ['id']));
      const strg = await this.storageService.getOneBy({ user });

      if (!strg) {
        throw new HttpException('Хранилище не найдено', HttpStatus.BAD_REQUEST);
      }

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

  async checkParentsAndDelete(storage: Types.ObjectId): Promise<any> {
    // ! Получить сторадж его содержимое и проверить есть ли элементы с уделенным родителем
    // ! если есть удалить

    // try {
    //   const deletedTracks: Types.ObjectId[] = [];

    //   let size = 0;
    //   const strg = await this.findByIdAndCheck(storage);

    //   for await (const id of strg.tracks) {
    //     const track = await this.trackService.getOneById(id);
    //     const parent = await this.trackService.getOneBy({ parent: track._id });

    //     if (!parent) {
    //       const deletedTrack = await this.trackService.delete(track._id);
    //       deletedTracks.push(deletedTrack._id);
    //       size += deletedTrack.size;
    //     }
    //   }

    //   const delTracks = deletedTracks.map((ids) => ids.toString());
    //   strg.tracks = strg.tracks.filter((itm) => !delTracks.includes(itm.toString()));

    //   strg.usedSpace -= size;
    //   return await strg.save();
    // } catch (e) {
    //   throw new HttpException('Ошибка при проверке родителей', HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    throw new HttpException('Ошибка при проверке родителей', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
