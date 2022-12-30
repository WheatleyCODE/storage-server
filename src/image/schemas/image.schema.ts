import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { StorageItemCommentsSchema } from 'src/core';

export type ImageDocument = Image & Document;

@Schema()
export class Image extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'static/image/fsad-sdsa.jpg',
    description: 'Путь к файлу на сервере',
  })
  @Prop({ required: true, type: String })
  file: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес картинки',
  })
  @Prop({ required: true, type: Number })
  fileSize: number;

  @ApiProperty({
    example: 'png',
    description: 'Формат файла',
  })
  @Prop({ required: true, type: String })
  fileExt: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
