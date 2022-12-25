import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { StorageItemSchema } from 'src/core';
import { ItemTypes } from 'src/types';

export type FileDocument = File & Document;

@Schema()
export class File extends StorageItemSchema {
  @ApiProperty({
    example: 'FILE',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.FILE, type: String })
  type: ItemTypes;

  @ApiProperty({
    example: 'static/file/fsad-sdsa.mp4',
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
}

export const FileSchema = SchemaFactory.createForClass(File);
