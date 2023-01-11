import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { CommentModule } from 'src/comment/comment.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    StorageModule,
    TokensModule,
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    CommentModule,
  ],
  providers: [FolderService],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {}
