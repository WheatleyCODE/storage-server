import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { VideoTransferData } from 'src/transfer';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';

@Controller('/api/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTrack(
    @UploadedFiles() files: { image?: Express.Multer.File[]; video?: Express.Multer.File[] },
    @Body() dto: CreateVideoDto,
    @Req() req: UserReq,
  ): Promise<VideoTransferData> {
    const id = stringToOjbectId(req.userTD.id);

    return this.videoService.createVideo(
      dto,
      id,
      files?.video && files.video[0],
      files?.image && files.image[0],
    );
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/change/image')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  changeImage(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() dto: ChangeFileDto,
    @Req() req: UserReq,
  ): Promise<VideoTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.videoService.changeImage(dto, id, files?.image && files.image[0]);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'audio', maxCount: 1 }]))
  @Post('/change/file')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  changeFile(
    @UploadedFiles() files: { audio?: Express.Multer.File[] },
    @Body() dto: ChangeFileDto,
    @Req() req: UserReq,
  ): Promise<VideoTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.videoService.changeFile(dto, id, files?.audio && files.audio[0]);
  }
}
