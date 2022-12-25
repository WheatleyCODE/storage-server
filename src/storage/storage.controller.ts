import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as uuid from 'uuid';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CreateFolderDto } from 'src/folder/dto/create-folder.dto';
import { CreateTrackDto } from 'src/track/dto/create-track-dto';
import { AddListenDto } from './dto/add-listen.dto';
import { ChangeAccessTypeDto } from './dto/change-access-type.dto';
import { ChangeTrackFilesDto } from './dto/change-track-files.dto';
import { ChangeIsTrashDto } from './dto/change-is-trash.dto';
import { ChangeLikeDto } from './dto/change-like.dto';
import { ChangeOpenDateDto } from './dto/change-open-date.dto';
import { CreateAccessLinkDto } from './dto/create-access-link.dto';
import { SearchItemDto } from './dto/search-item.dto';
import { StorageService } from './storage.service';
import { CopyFileDto } from './dto/copy-file.dto';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { AddCommentDto } from 'src/comment/dto/add-comment.dto';
import { DeleteCommentDto } from 'src/comment/dto/delete-comment.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { ChangeColorDto } from './dto/change-color.dto';
import { ChangeNameDto } from './dto/change-name.dto';
import { ChangeParentDto } from './dto/change-parent.dto';
import { UploadFilesDto } from './dto/upload-files.dto';
import { DownloadArchiveDto } from './dto/download-archive.dto';
import { DownloadFileDto } from './dto/download-file.dto';
import {
  FolderTransferData,
  StorageTransferData,
  TrackTransferData,
  FileTransferData,
  AlbumTransferData,
  CommentTransferData,
} from 'src/transfer';
import { stringToOjbectId } from 'src/utils';
import { ChildrensTransferData, ItemTransferData, UserReq, UserRes } from 'src/types';

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
  @UsePipes(ValidationPipe)
  createFile(
    @UploadedFiles() files: { file: Express.Multer.File[] },
    @Body() dto: CreateFileDto,
    @Req() req: UserReq,
  ): Promise<FileTransferData> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.createFile(dto, correctId, files.file[0]);
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

  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Post('/upload/files')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  uploadFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() dto: UploadFilesDto,
    @Req() req: UserReq,
  ): Promise<ItemTransferData[]> {
    const correctId = stringToOjbectId(req.userTD.id);

    return this.storageService.uploadFiles(dto, correctId, files.files);
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

  @Post('/copy/files')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  copyFile(@Body() dto: CopyFileDto, @Req() req: UserReq): Promise<ItemTransferData[]> {
    const correctId = stringToOjbectId(req.userTD.id);
    return this.storageService.copyFile(dto, correctId);
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

  @Post('/download/file')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async downloadFiles(
    @Body() dto: DownloadFileDto,
    @Res({ passthrough: true }) res: UserRes,
  ): Promise<any> {
    const { file, filename } = await this.storageService.downloadFile(dto);

    res.set({
      Filename: filename,
    });

    return file;
  }

  @Post('/download/archive')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async downloadArchive(@Body() dto: DownloadArchiveDto, @Res() res: UserRes): Promise<any> {
    res.set({
      Filename: `${uuid.v4()}.zip`,
    });

    const fileArr = await this.storageService.downloadArchive(dto.items);
    return res.zip(fileArr);
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
