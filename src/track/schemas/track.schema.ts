import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { DefaultObjectSchema } from 'src/core';

export type TrackDocument = Track & Document;

@Schema()
export class Track extends DefaultObjectSchema {
  @ApiProperty({
    example: 'Oxxymiron',
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
    example: 'static/audio/fsad-sdsa.mp4',
    description: 'Путь к аудио на сервере',
  })
  @Prop({ required: true, type: String })
  audio: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Альбома',
  })
  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album: Types.ObjectId;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
