import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TrackTransferData } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { TrackService } from './track.service';

@Controller('/api/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks(
    @Query('count') count: number,
    @Query('offset') offset: number,
  ): Promise<TrackTransferData[]> {
    return this.trackService.getAllToDto({ count, offset });
  }

  @Get('/:id')
  getOneTrack(@Param() param: { id: string }): Promise<TrackTransferData> {
    const correctId = stringToOjbectId(param.id);
    return this.trackService.getOneByIdToDto(correctId);
  }

  @Get('/search')
  search(@Query('query') query: string): void {
    throw new Error('Method not implemented.');
  }
}
