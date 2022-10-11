import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentModule } from 'src/comment/comment.module';
import { FilesModule } from 'src/files/files.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    TokensModule,
    FilesModule,
    CommentModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
