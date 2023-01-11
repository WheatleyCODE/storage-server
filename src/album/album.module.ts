import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { TrackModule } from 'src/track/track.module';
import { CommentModule } from 'src/comment/comment.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album, AlbumSchema } from './schemas/album.schema';
import { StorageModule } from 'src/storage/storage.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [
    StorageModule,
    TokensModule,
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    FilesModule,
    TrackModule,
    CommentModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
