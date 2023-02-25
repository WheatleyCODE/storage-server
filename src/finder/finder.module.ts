import { Module } from '@nestjs/common';
import { FinderService } from './finder.service';
import { FinderController } from './finder.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { FileModule } from 'src/file/file.module';
import { ImageModule } from 'src/image/image.module';
import { TrackModule } from 'src/track/track.module';
import { VideoModule } from 'src/video/video.module';
import { StorageModule } from 'src/storage/storage.module';
import { FolderModule } from 'src/folder/folder.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    TokensModule,
    FileModule,
    AlbumModule,
    FolderModule,
    ImageModule,
    TrackModule,
    VideoModule,
    StorageModule,
  ],
  providers: [FinderService],
  controllers: [FinderController],
  exports: [],
})
export class FinderModule {}
