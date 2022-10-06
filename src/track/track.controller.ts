import { stringToOjbectId } from 'src/utils';
import { Body, Param, Controller, Get, Post, Query, StreamableFile } from '@nestjs/common';
import { TrackTransferData } from 'src/types';
import { SearchTrackDto } from './dto/SerchTrack.dto';
import { TrackService } from './track.service';

@Controller('/api/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<TrackTransferData[]> {
    return this.trackService.getAllPublicTracks({ count, offset });
  }

  @Post('/search')
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Body() dto: SearchTrackDto,
  ): Promise<TrackTransferData[]> {
    return this.trackService.searchPublicTracks(dto.text, { count, offset });
  }
}