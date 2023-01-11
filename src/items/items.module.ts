import { Module } from '@nestjs/common';
import { AlbumModule } from 'src/album/album.module';
import { FileModule } from 'src/file/file.module';
import { FolderModule } from 'src/folder/folder.module';
import { ImageModule } from 'src/image/image.module';
import { StorageModule } from 'src/storage/storage.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { TrackModule } from 'src/track/track.module';
import { VideoModule } from 'src/video/video.module';
import { ItemsService } from './items.service';

@Module({
  imports: [
    StorageModule,
    TokensModule,
    FolderModule,
    TrackModule,
    FileModule,
    AlbumModule,
    ImageModule,
    VideoModule,
  ],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
