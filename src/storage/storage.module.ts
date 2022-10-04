import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Storage, StorageSchema } from './schemas/storage.schema';
import { TokensModule } from 'src/tokens/tokens.module';
import { FolderModule } from 'src/folder/folder.module';

@Module({
  imports: [
    TokensModule,
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    FolderModule,
  ],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
