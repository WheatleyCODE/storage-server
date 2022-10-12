import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { CreateTrackDto } from 'src/track/dto/createTrackDto';
import { ItemDocument } from 'src/types';
import {
  FolderTransferData,
  StorageTransferData,
  TrackTransferData,
  FileTransferData,
  AlbumTransferData,
  CommentTransferData,
} from 'src/transfer';
import { dtoToOjbectId, stringToOjbectId } from 'src/utils';
import { AddDeleteItemDto } from './dto/AddDeleteItem.dto';
import { AddListenDto } from './dto/AddListen.dto';
import { ChangeAccessTypeDto } from './dto/ChangeAccessType.dto';
import { ChangeTrackFilesDto } from './dto/ChangeTrackFiles.dto';
import { ChangeIsTrashDto } from './dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from './dto/ChangeLike.dto';
import { ChangeOpenDateDto } from './dto/ChangeOpenDate.dto';
import { CreateAccessLinkDto } from './dto/CreateAccessLink.dto';
import { CreateStorageDto } from './dto/CreateStorage.dto';
import { SearchItemDto } from './dto/SearchItem.dto';
import { StorageDocument } from './schemas/storage.schema';
import { StorageService } from './storage.service';
import { CopyFileDto } from './dto/CopyFile.dto';
import { CreateFileDto } from 'src/file/dto/CreateFileDto';
import { CreateAlbumDto } from 'src/album/dto/CreateAlbum.dto';
import { AddCommentDto } from '../comment/dto/AddComment.dto';
import { DeleteCommentDto } from 'src/comment/dto/DeleteComment.dto';

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

  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Post('/create/file')
  createFile(
    @UploadedFiles() files: { file?: Express.Multer.File[] },
    @Body() dto: CreateFileDto,
  ): Promise<FileTransferData> {
    return this.storageService.createFile(dto, files?.file && files.file[0]);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/create/album')
  createAlbum(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
  ): Promise<AlbumTransferData> {
    return this.storageService.createAlbum(dto, files?.image && files?.image[0]);
  }

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
  ): Promise<TrackTransferData> {
    return this.storageService.createTrack(dto, files.audio[0], files?.image && files.image[0]);
  }

  @Post('/delete/item')
  deleteItem(@Body() dto: AddDeleteItemDto): Promise<StorageDocument> {
    return this.storageService.deleteItem(dto);
  }

  @Post('/change/access')
  changeAccessType(@Body() dto: ChangeAccessTypeDto): Promise<ItemDocument> {
    return this.storageService.changeAccessType(dto);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @Post('/change/track/files')
  createTrackTest(
    @UploadedFiles() files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: ChangeTrackFilesDto,
  ): Promise<TrackTransferData> {
    return this.storageService.changeTrackFiles(
      dto,
      files?.audio && files.audio[0],
      files?.image && files.image[0],
    );
  }

  @Post('/copy/file')
  copyFile(@Body() dto: CopyFileDto): Promise<ItemDocument> {
    return this.storageService.copyFile(dto);
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

  @Post('/search/items')
  searchItems(@Body() dto: SearchItemDto): Promise<ItemDocument[]> {
    return this.storageService.searchItems(dto);
  }

  @Post('/create/comment')
  createComment(@Body() dto: AddCommentDto): Promise<CommentTransferData> {
    return this.storageService.createComment(dto);
  }

  @Post('/delete/comment')
  deleteComment(@Body() dto: DeleteCommentDto): Promise<CommentTransferData> {
    return this.storageService.deleteComment(dto);
  }

  // * Поинт для тестирования
  @Post('/test/delete/:id')
  deleteStorage(@Param() param: { id: string }): Promise<StorageDocument> {
    const correctId = stringToOjbectId(param.id);
    return this.storageService.delete(correctId);
  }

  // * Поинт для тестирования
  @Post('/test/create')
  createStorage(@Body() dto: CreateStorageDto): Promise<StorageDocument> {
    const correctDto = dtoToOjbectId(dto, ['user']);
    return this.storageService.create({
      ...correctDto,
      name: 'Тестовое хранилище',
    });
  }
}
