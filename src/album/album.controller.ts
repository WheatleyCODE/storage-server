import { Controller, Post, Body } from '@nestjs/common';
import { AlbumService } from './album.service';
import { ChangeTracksDto } from './dto/change-tracks.dto';

@Controller('/api/album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('/change/tracks')
  async changeTracks(@Body() dto: ChangeTracksDto): Promise<any> {
    return this.albumService.changeTracks(dto);
  }
}
