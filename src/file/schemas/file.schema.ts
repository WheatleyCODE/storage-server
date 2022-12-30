import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { StorageItemCommentsSchema } from 'src/core';

export type FileDocument = File & Document;

@Schema()
export class File extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'static/file/fsad-sdsa.txt',
    description: 'Путь к файлу на сервере',
  })
  @Prop({ required: true, type: String })
  file: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес файла',
  })
  @Prop({ required: true, type: Number })
  fileSize: number;

  @ApiProperty({
    example: 'txt',
    description: 'Формат файла',
  })
  @Prop({ required: true, type: String })
  fileExt: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
