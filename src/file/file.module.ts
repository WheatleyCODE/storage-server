import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesModule } from 'src/files/files.module';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]), FilesModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
