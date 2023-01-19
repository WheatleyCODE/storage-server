import { Body, Controller, Post, Res, UseGuards, UsePipes } from '@nestjs/common';
import * as uuid from 'uuid';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { UserRes } from 'src/types';
import { DownloaderService } from './downloader.service';
import { DownloadArchiveDto } from './dto/download-archive.dto';
import { DownloadFileDto } from './dto/download-file.dto';

@Controller('/api/downloader')
export class DownloaderController {
  constructor(private readonly downloaderService: DownloaderService) {}

  @Post('/file')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async downloadFiles(
    @Body() dto: DownloadFileDto,
    @Res({ passthrough: true }) res: UserRes,
  ): Promise<any> {
    const { file, filename } = await this.downloaderService.downloadFile(dto);

    res.set({
      Filename: filename,
    });

    return file;
  }

  @Post('/archive')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async downloadArchive(@Body() dto: DownloadArchiveDto, @Res() res: UserRes): Promise<any> {
    res.set({
      Filename: `${uuid.v4()}.zip`,
    });

    const fileArr = await this.downloaderService.downloadArchive(dto.items);
    return res.zip(fileArr);
  }
}
