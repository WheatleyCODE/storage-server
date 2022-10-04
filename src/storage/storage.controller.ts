import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { StorageTransferData } from 'src/types';
import { FolderTransferData } from 'src/types/folder';
import { stringToOjbectId } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
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
}
