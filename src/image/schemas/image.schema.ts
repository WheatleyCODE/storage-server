import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { DefaultObjectSchema } from 'src/core';
import { ItemTypes } from 'src/types';

export type ImageDocument = Image & Document;

@Schema()
export class Image extends DefaultObjectSchema {
  @ApiProperty({
    example: 'IMAGE',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.IMAGE, type: String })
  type: ItemTypes;

  @ApiProperty({
    example: 'static/image/fsad-sdsa.jpg',
    description: 'Путь к файлу на сервере',
  })
  @Prop({ required: true, type: String })
  image: string;

  @ApiProperty({
    example: 123456,
    description: 'Вес картинки',
  })
  @Prop({ required: true, type: Number })
  imageSize: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
