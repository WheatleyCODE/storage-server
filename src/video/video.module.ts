import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { FilesModule } from 'src/files/files.module';
import { Video, VideoSchema } from './schemas/video.schema';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    FilesModule,
    CommentModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
