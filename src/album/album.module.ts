import { CommentModule } from './../comment/comment.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { TrackModule } from 'src/track/track.module';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album, AlbumSchema } from './schemas/album.schema';

@Module({
  imports: [
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
