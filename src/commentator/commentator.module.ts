import { Module } from '@nestjs/common';
import { CommentatorService } from './commentator.service';
import { CommentatorController } from './commentator.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { FolderModule } from 'src/folder/folder.module';
import { TrackModule } from 'src/track/track.module';
import { FileModule } from 'src/file/file.module';
import { AlbumModule } from 'src/album/album.module';
import { ImageModule } from 'src/image/image.module';
import { VideoModule } from 'src/video/video.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    TokensModule,
    FolderModule,
    TrackModule,
    FileModule,
    AlbumModule,
    ImageModule,
    VideoModule,
    CommentModule,
  ],
  providers: [CommentatorService],
  controllers: [CommentatorController],
  exports: [],
})
export class CommentatorModule {}
