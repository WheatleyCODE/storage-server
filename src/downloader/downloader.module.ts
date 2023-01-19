import { Module } from '@nestjs/common';
import { DownloaderService } from './downloader.service';
import { DownloaderController } from './downloader.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { AlbumModule } from 'src/album/album.module';
import { FileModule } from 'src/file/file.module';
import { FolderModule } from 'src/folder/folder.module';
import { ImageModule } from 'src/image/image.module';
import { TrackModule } from 'src/track/track.module';
import { VideoModule } from 'src/video/video.module';

@Module({
  imports: [
    TokensModule,
    FolderModule,
    TrackModule,
    FileModule,
    AlbumModule,
    ImageModule,
    VideoModule,
  ],
  providers: [DownloaderService],
  controllers: [DownloaderController],
  exports: [],
})
export class DownloaderModule {}
