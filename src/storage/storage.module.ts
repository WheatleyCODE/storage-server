import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Storage, StorageSchema } from './schemas/storage.schema';
import { TokensModule } from 'src/tokens/tokens.module';
import { FolderModule } from 'src/folder/folder.module';
import { TrackModule } from 'src/track/track.module';
import { FileModule } from 'src/file/file.module';
import { AlbumModule } from 'src/album/album.module';

@Module({
  imports: [
    TokensModule,
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    FolderModule,
    TrackModule,
    FileModule,
    AlbumModule,
  ],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
