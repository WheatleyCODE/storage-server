import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { CommentModule } from 'src/comment/comment.module';
import { StorageModule } from 'src/storage/storage.module';
import { TrackModule } from 'src/track/track.module';
import { FileModule } from 'src/file/file.module';
import { AlbumModule } from 'src/album/album.module';
import { ImageModule } from 'src/image/image.module';
import { VideoModule } from 'src/video/video.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    StorageModule,
    TokensModule,
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    CommentModule,
    TrackModule,
    FileModule,
    AlbumModule,
    ImageModule,
    VideoModule,
    FilesModule,
  ],
  providers: [FolderService],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {}
