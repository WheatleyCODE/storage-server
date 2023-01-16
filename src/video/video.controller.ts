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
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { VideoTransferData } from 'src/transfer';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { CreateVideoDto } from './dto/create-video.dto';
import { SearchVideoDto } from './dto/search-video.dto';
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

  @Get('/public')
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<VideoTransferData[]> {
    return this.videoService.getAllPublicVideos(count, offset);
  }

  @Get('/public/search')
  @UsePipes(ValidationPipe)
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Body() dto: SearchVideoDto,
  ): Promise<VideoTransferData[]> {
    return this.videoService.searchPublicVideos(dto.text, count, offset);
  }
}
