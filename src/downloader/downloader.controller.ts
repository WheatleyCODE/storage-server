import { Body, Controller, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { UserRes } from 'src/types';
import { DownloaderService } from './downloader.service';
import { DownloadArchiveDto } from './dto/download-archive.dto';

@Controller('/api/downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Post('/archive')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async downloadArchive(@Body() dto: DownloadArchiveDto, @Res() res: UserRes): Promise<any> {
    const { files, archiveName } = await this.downloaderService.downloadArchive(dto.items);

    res.set({
      Filename: archiveName,
    });

    return res.zip(files);
  }
}
