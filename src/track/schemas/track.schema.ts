import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { StorageItemCommentsSchema } from 'src/core';

export type TrackDocument = Track & Document;

@Schema()
export class Track extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'Oxxxymiron',
    description: 'Автор трека',
  })
  @Prop({ required: true, type: String })
  author: string;

  @ApiProperty({
    example: 'Some random text...',
    description: 'Текст трека',
  })
  @Prop({ type: String })
  text: string;

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
    example: 'static/audio/fsad-sdsa.mp4',
    description: 'Путь к аудио на сервере',
  })
  @Prop({ required: true, type: String })
  file: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес аудио',
  })
  @Prop({ required: true, type: Number })
  fileSize: number;

  @ApiProperty({
    example: 'mp3',
    description: 'Формат файла',
  })
  @Prop({ required: true, type: String })
  fileExt: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Альбома',
  })
  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album: Types.ObjectId;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
