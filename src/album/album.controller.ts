import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UseGuards,
  UsePipes,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { AlbumTransferData } from 'src/transfer';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { AlbumService } from './album.service';
import { ChangeFileDto } from './dto/change-file.dto';
import { ChangeTracksDto } from './dto/change-tracks.dto';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('/api/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createAlbum(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() dto: CreateAlbumDto,
    @Req() req: UserReq,
  ): Promise<AlbumTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.albumService.createAlbum(dto, id, files?.image && files?.image[0]);
  }

  @Post('/change/tracks')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async changeTracks(
    @Body() dto: ChangeTracksDto,
    @Req() req: UserReq,
  ): Promise<AlbumTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.albumService.changeTracks(dto, id);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/change/image')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTrackTest(
    @Body() dto: ChangeFileDto,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Req() req: UserReq,
  ): Promise<AlbumTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.albumService.changeImage(dto, id, files?.image && files.image[0]);
  }
}
