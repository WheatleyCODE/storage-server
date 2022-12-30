import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { StorageItemCommentsSchema } from 'src/core';

export type AlbumDocument = Album & Document;

@Schema()
export class Album extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'Oxxxymiron',
    description: 'Автор альбома',
  })
  @Prop({ required: true, type: String })
  author: string;

  @ApiProperty({
    example: 'static/image/fsad-sdsa.jpg',
    description: 'Путь к картинке на сервере',
  })
  @Prop({ required: true, type: String })
  image: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес картиник',
  })
  @Prop({ required: true, type: Number })
  imageSize: number;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Треки в альбоме',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Track' })
  tracks: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
