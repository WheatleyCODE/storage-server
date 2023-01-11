import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { FilesModule } from 'src/files/files.module';
import { StorageModule } from 'src/storage/storage.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { Track, TrackSchema } from './schemas/track.schema';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';

@Module({
  imports: [
    TokensModule,
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    FilesModule,
    CommentModule,
    StorageModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
