import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { StorageItemCommentsSchema } from 'src/core';

export type VideoDocument = Video & Document;

@Schema()
export class Video extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'Some random ...',
    description: 'Текст трека',
  })
  @Prop({ type: String })
  description: string;

  @ApiProperty({
    example: 'static/image/fsad-sdsa.png',
    description: 'Путь к картинке на сервере',
  })
  @Prop({ type: String })
  image: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес картинки',
  })
  @Prop({ type: Number })
  imageSize: number;

  @ApiProperty({
    example: 'static/video/fsad-sdsa.mp4',
    description: 'Путь к видео на сервере',
  })
  @Prop({ required: true, type: String })
  file: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес видео',
  })
  @Prop({ required: true, type: Number })
  fileSize: number;

  @ApiProperty({
    example: 'mp4',
    description: 'Формат файла',
  })
  @Prop({ required: true, type: String })
  fileExt: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
