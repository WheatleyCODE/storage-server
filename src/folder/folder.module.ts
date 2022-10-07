import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { TrackModule } from 'src/track/track.module';

@Module({
  imports: [TokensModule, MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }])],
  providers: [FolderService],
  controllers: [FolderController],
  exports: [FolderService],
})
export class FolderModule {}
