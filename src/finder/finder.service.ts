import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { ItemTDataFactory } from 'src/transfer';
import {
  IFinderService,
  ItemDocument,
  ItemTransferData,
  ItemTypes,
  ObjectServices,
  ObjectServicesKeys,
} from 'src/types';
import { VideoService } from 'src/video/video.service';
import { SearchItemDto } from './dto/search-item.dto';

@Injectable()
export class FinderService implements IFinderService {
  private readonly objectServices: ObjectServices;
  private readonly objectServicesKeys: ObjectServicesKeys[];

  constructor(
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
    private readonly albumService: AlbumService,
    private readonly imageService: ImageService,
    private readonly folderService: FolderService,
    private readonly videoService: VideoService,
    private readonly storageService: StorageService,
  ) {
    this.objectServices = {
      [ItemTypes.FOLDER]: folderService,
      [ItemTypes.TRACK]: trackService,
      [ItemTypes.FILE]: fileService,
      [ItemTypes.ALBUM]: albumService,
      [ItemTypes.IMAGE]: imageService,
      [ItemTypes.VIDEO]: videoService,
    };

    this.objectServicesKeys = Object.keys(this.objectServices) as ObjectServicesKeys[];
  }

  async searchStorageItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    try {
      const { text } = dto;
      await this.storageService.getOneByAndCheck({ user });

      let itemDocs: ItemDocument[] = [];

      for await (const key of this.objectServicesKeys) {
        const items = await this.objectServices[key].getAllBy({ user });
        itemDocs = [...itemDocs, ...items];
      }

      itemDocs = itemDocs.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));

      return itemDocs.map((item) => ItemTDataFactory.create(item));
    } catch (e) {
      throw e;
    }
  }

  async searchPublicItems(text: string, count = 10, offset = 0): Promise<ItemTransferData[]> {
    let itemDocs: ItemDocument[] = [];

    for await (const key of this.objectServicesKeys) {
      const items = await this.objectServices[key].searchPublic(text, count, offset);
      itemDocs = [...itemDocs, ...items];
    }

    return itemDocs.map((item) => ItemTDataFactory.create(item));
  }

  async getAllPublicItems(count = 10, offset = 0): Promise<ItemTransferData[]> {
    let itemDocs: ItemDocument[] = [];

    for await (const key of this.objectServicesKeys) {
      const items = await this.objectServices[key].getAllPublic(count, offset);
      itemDocs = [...itemDocs, ...items];
    }

    return itemDocs.map((item) => ItemTDataFactory.create(item));
  }
}
