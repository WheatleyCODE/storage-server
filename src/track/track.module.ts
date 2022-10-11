import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { FilesModule } from 'src/files/files.module';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    FilesModule,
    CommentModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
