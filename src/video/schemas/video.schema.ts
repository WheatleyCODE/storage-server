import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { StorageItemSchema } from 'src/core';
import { ItemTypes } from 'src/types';

export type VideoDocument = Video & Document;

@Schema()
export class Video extends StorageItemSchema {
  @ApiProperty({
    example: 'VIDEO',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.VIDEO, type: String })
  type: ItemTypes;

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
  video: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес видео',
  })
  @Prop({ required: true, type: Number })
  videoSize: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
