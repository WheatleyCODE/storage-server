import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FolderService } from 'src/folder/folder.service';
import { ImageService } from 'src/image/image.service';
import { AddListenDto } from 'src/storage/dto/add-listen.dto';
import { ChangeAccessTypeDto } from 'src/storage/dto/change-access-type.dto';
import { ChangeIsTrashDto } from 'src/storage/dto/change-is-trash.dto';
import { ChangeLikeDto } from 'src/storage/dto/change-like.dto';
import { ChangeOpenDateDto } from 'src/storage/dto/change-open-date.dto';
import { CopyFileDto } from 'src/storage/dto/copy-file.dto';
import { CreateAccessLinkDto } from 'src/storage/dto/create-access-link.dto';
import { DeleteItemDto } from 'src/storage/dto/delete-item.dto';
import { SearchItemDto } from 'src/storage/dto/search-item.dto';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { StorageTransferData } from 'src/transfer';
import { IItemsService, ItemTransferData, ItemTypes, ObjectServices } from 'src/types';
import { VideoService } from 'src/video/video.service';

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

  deleteItem(dto: DeleteItemDto, user: Types.ObjectId): Promise<StorageTransferData> {
    throw new Error('Method not implemented.');
  }

  searchItems(dto: SearchItemDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }

  changeAccessType(dto: ChangeAccessTypeDto): Promise<ItemTransferData> {
    throw new Error('Method not implemented.');
  }

  changeAccessLink(dto: CreateAccessLinkDto): Promise<ItemTransferData> {
    throw new Error('Method not implemented.');
  }

  changeIsTrash(dto: ChangeIsTrashDto): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }

  changeLike(dto: ChangeOpenDateDto): Promise<ItemTransferData> {
    throw new Error('Method not implemented.');
  }

  addListen(dto: AddListenDto): Promise<ItemTransferData> {
    throw new Error('Method not implemented.');
  }

  changeOpenDate(dto: ChangeLikeDto): Promise<ItemTransferData> {
    throw new Error('Method not implemented.');
  }

  copyFile(dto: CopyFileDto, user: Types.ObjectId): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }
}
