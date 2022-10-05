import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { CreateTrackDto } from 'src/track/dto/createTrackDto';
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

  // @UseGuards(JwtAuthGuard)
  // @UsePipes(ValidationPipe)
  // @Put(':id')
  // updateOneTrack(@Param() param: { id: string }, @Body() dto: CreateTrackDto): Promise<TrackDocument> {
  //   return this.trackService.updateOneTrack(param.id, dto);
  // }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @Post('/create/track')
  createTrack(
    @UploadedFiles() files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ): Promise<any> {
    const { image, audio } = files;
    return this.storageService.createTrack(dto, image[0], audio[0]);
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
    return this.storageService.changeAccessLink(dto);
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
