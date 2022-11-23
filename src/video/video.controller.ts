import { Body, Controller, Get, Query } from '@nestjs/common';
import { VideoTransferData } from 'src/transfer';
import { SearchVideoDto } from './dto/SerchVideo.dto';
import { VideoService } from './video.service';

@Controller('/api/video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('/public')
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<VideoTransferData[]> {
    return this.videoService.getAllPublicVideos(count, offset);
  }

  @Get('/public/search')
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Body() dto: SearchVideoDto,
  ): Promise<VideoTransferData[]> {
    return this.videoService.searchPublicVideos(dto.text, count, offset);
  }
}
