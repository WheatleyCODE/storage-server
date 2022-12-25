import { Body, Controller, Get, Query } from '@nestjs/common';
import { SearchTrackDto } from './dto/serch-track.dto';
import { TrackService } from './track.service';
import { TrackTransferData } from 'src/transfer';

@Controller('/api/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get('/public')
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<TrackTransferData[]> {
    return this.trackService.getAllPublicTracks(count, offset);
  }

  @Get('/public/search')
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Body() dto: SearchTrackDto,
  ): Promise<TrackTransferData[]> {
    return this.trackService.searchPublicTracks(dto.text, count, offset);
  }
}
