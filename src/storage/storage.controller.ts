import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CreateFolderDto } from 'src/folder/dto/CreateFolder.dto';
import { CreateTrackDto } from 'src/track/dto/createTrackDto';
import { stringToOjbectId } from 'src/utils';
import { AddListenDto } from './dto/AddListen.dto';
import { ChangeAccessTypeDto } from './dto/ChangeAccessType.dto';
import { ChangeTrackFilesDto } from './dto/ChangeTrackFiles.dto';
import { ChangeIsTrashDto } from './dto/ChangeIsTrash.dto';
import { ChangeLikeDto } from './dto/ChangeLike.dto';
import { ChangeOpenDateDto } from './dto/ChangeOpenDate.dto';
import { CreateAccessLinkDto } from './dto/CreateAccessLink.dto';
import { SearchItemDto } from './dto/SearchItem.dto';
import { StorageService } from './storage.service';
import { CopyFileDto } from './dto/CopyFile.dto';
import { CreateFileDto } from 'src/file/dto/CreateFileDto';
import { CreateAlbumDto } from 'src/album/dto/CreateAlbum.dto';
import { AddCommentDto } from 'src/comment/dto/AddComment.dto';
import { DeleteCommentDto } from 'src/comment/dto/DeleteComment.dto';
import { ChildrensTransferData, ItemTransferData, UserReq } from 'src/types';
import {
  FolderTransferData,
  StorageTransferData,
  TrackTransferData,
  FileTransferData,
  AlbumTransferData,
  CommentTransferData,
} from 'src/transfer';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { DeleteItemDto } from './dto/DeleteItem.dto';
import { ChangeColorDto } from './dto/ChangeColor.dto';
import { ChangeNameDto } from './dto/ChangeName.dto';
import { ChangeParentDto } from './dto/ChangeParent.dto';

@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getStorage(@Req() req: UserReq): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.getStorage(correctId);
  }

  @Post('/create/folder')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createFolder(@Body() dto: CreateFolderDto, @Req() req: UserReq): Promise<FolderTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.createFolder(dto, correctId);
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
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createAlbum(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
    @Req() req: UserReq,
  ): Promise<AlbumTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.createAlbum(dto, correctId, files?.image && files?.image[0]);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @Post('/create/track')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTrack(
    @UploadedFiles() files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
    @Req() req: UserReq,
  ): Promise<TrackTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);

    return this.storageService.createTrack(
      dto,
      correctId,
      files?.audio && files.audio[0],
      files?.image && files.image[0],
    );
  }

  @Post('/delete/items')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  deleteItem(@Body() dto: DeleteItemDto, @Req() req: UserReq): Promise<StorageTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.deleteItem(dto, correctId);
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
  copyFile(@Body() dto: CopyFileDto): Promise<ItemTransferData> {
    return this.storageService.copyFile(dto);
  }

  @Post('/change/trash')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeIsTrash(@Body() dto: ChangeIsTrashDto): Promise<ItemTransferData[]> {
    return this.storageService.changeIsTrash(dto);
  }

  @Post('/change/color')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeColor(@Body() dto: ChangeColorDto): Promise<FolderTransferData[]> {
    return this.storageService.changeColor(dto);
  }

  @Post('/change/name')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeName(@Body() dto: ChangeNameDto): Promise<ItemTransferData> {
    return this.storageService.changeName(dto);
  }

  @Post('/change/parent')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeParent(@Body() dto: ChangeParentDto): Promise<ItemTransferData[]> {
    return this.storageService.changeParent(dto);
  }

  @Post('/create/access-link')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createAccessLink(@Body() dto: CreateAccessLinkDto): Promise<ItemTransferData> {
    return this.storageService.changeAccessLink(dto);
  }

  @Post('/change/access')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  changeAccessType(@Body() dto: ChangeAccessTypeDto): Promise<ItemTransferData> {
    return this.storageService.changeAccessType(dto);
  }

  @Get('/childrens/:id')
  @UseGuards(JwtAuthGuard)
  getChildrens(@Param() param): Promise<ChildrensTransferData> {
    const correctId = stringToOjbectId(param.id);
    return this.storageService.getChildrens(correctId);
  }

  @Post('/change/like')
  changeLike(@Body() dto: ChangeLikeDto): Promise<ItemTransferData> {
    return this.storageService.changeLike(dto);
  }

  @Post('/change/open-date')
  changeOpenDate(@Body() dto: ChangeOpenDateDto): Promise<ItemTransferData> {
    return this.storageService.changeOpenDate(dto);
  }

  @Post('/add/listen')
  addListen(@Body() dto: AddListenDto): Promise<ItemTransferData> {
    return this.storageService.addListen(dto);
  }

  @Post('/search/items')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  searchItems(@Body() dto: SearchItemDto, @Req() req: UserReq): Promise<ItemTransferData[]> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.searchItems(dto, correctId);
  }

  @Post('/create/comment')
  createComment(@Body() dto: AddCommentDto): Promise<CommentTransferData> {
    return this.storageService.createComment(dto);
  }

  @Post('/delete/comment')
  deleteComment(@Body() dto: DeleteCommentDto): Promise<CommentTransferData> {
    return this.storageService.deleteComment(dto);
  }
}
