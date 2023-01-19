import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { UploaderController } from './uploader.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { FileModule } from 'src/file/file.module';
import { ImageModule } from 'src/image/image.module';
import { TrackModule } from 'src/track/track.module';
import { VideoModule } from 'src/video/video.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [TokensModule, FileModule, ImageModule, TrackModule, VideoModule, StorageModule],
  providers: [UploaderService],
  controllers: [UploaderController],
  exports: [],
})
export class UploaderModule {}
