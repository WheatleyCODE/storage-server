import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { ItemDocument, StorageTransferData } from 'src/types';
import { FolderTransferData } from 'src/types/folder';
import { stringToOjbectId } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
import { AddListenDto } from './dto/AddListen.dto';
import { ChangeAccessTypeDto } from './dto/ChangeAccessType.dto';
import { ChangeIsTrashDto } from './dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from './dto/ChangeLike.dto';
import { ChangeOpenDateDto } from './dto/ChangeOpenDate.dto';
import { CreateAccessLinkDto } from './dto/CreateAccessLink.dto';
import { StorageDocument } from './schemas/storage.schema';
import { StorageService } from './storage.service';

@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/user/:id')
  getStorage(@Param() param: { id: string }): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(param.id);
    return this.storageService.getStorage(correctId);
  }

  @Post('/create/folder')
  createFolder(@Body() dto: CreateFolderDto): Promise<FolderTransferData> {
    return this.storageService.createFolder(dto);
  }

  @Post('/delete/item')
  deleteItem(@Body() dto: AddDeleteItemDto): Promise<StorageDocument> {
    return this.storageService.deleteItem(dto);
  }

  @Post('/change/access')
  changeAccessType(@Body() dto: ChangeAccessTypeDto): Promise<ItemDocument> {
    return this.storageService.changeAccessType(dto);
  }

  @Post('/change/trash')
  changeIsTrash(@Body() dto: ChangeIsTrashDto): Promise<ItemDocument> {
    return this.storageService.changeIsTrash(dto);
  }

  @Post('/create/access-link')
  createAccessLink(@Body() dto: CreateAccessLinkDto): Promise<ItemDocument> {
    return this.storageService.createAccessLink(dto);
  }

  @Post('/change/like')
  changeLike(@Body() dto: ChangeLikeDto): Promise<ItemDocument> {
    return this.storageService.changeLike(dto);
  }

  @Post('/change/open-date')
  changeOpenDate(@Body() dto: ChangeOpenDateDto): Promise<ItemDocument> {
    return this.storageService.changeOpenDate(dto);
  }

  @Post('/add/listen')
  addListen(@Body() dto: AddListenDto): Promise<ItemDocument> {
    return this.storageService.addListen(dto);
  }
}
