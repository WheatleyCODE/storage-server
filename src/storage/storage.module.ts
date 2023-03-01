import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Storage, StorageSchema } from './schemas/storage.schema';
import { TokensModule } from 'src/tokens/tokens.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    TokensModule,
  ],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
