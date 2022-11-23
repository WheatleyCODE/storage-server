import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type StorageDocument = Storage & Document;

@Schema()
export class Storage {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    example: 'My_Base_2244',
    description: 'Название хранилища',
  })
  @Prop({ required: true, type: String })
  name: Types.ObjectId;

  @ApiProperty({
    example: 1024,
    description: 'Доступное место в байтах',
  })
  @Prop({ default: 1024 ** 3 * 10, type: Number })
  diskSpace: number;

  @ApiProperty({
    example: 0,
    description: 'Занятое место в байтах',
  })
  @Prop({ default: 0, type: Number })
  usedSpace: number;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Папки в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Folder' })
  folders: Types.ObjectId[];

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Треки в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Track' })
  tracks: Types.ObjectId[];

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Файлы в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'File' })
  files: Types.ObjectId[];

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Альбомы в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Album' })
  albums: Types.ObjectId[];

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Картинки в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Image' })
  images: Types.ObjectId[];

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'Видео в хранилище',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Video' })
  videos: Types.ObjectId[];
}

export const StorageSchema = SchemaFactory.createForClass(Storage);
