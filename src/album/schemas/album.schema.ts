import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { DefaultObjectSchema } from 'src/core';
import { ItemTypes } from 'src/types';

export type AlbumDocument = Album & Document;

@Schema()
export class Album extends DefaultObjectSchema {
  @ApiProperty({
    example: 'ALBUM',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.ALBUM, type: String })
  type: ItemTypes;

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
