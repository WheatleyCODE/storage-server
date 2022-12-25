import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { StorageItemSchema } from 'src/core';
import { FolderColors, ItemTypes } from 'src/types';

export type FolderDocument = Folder & Document;

@Schema()
export class Folder extends StorageItemSchema {
  @ApiProperty({
    example: 'FOLDER',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.FOLDER, type: String })
  type: ItemTypes;

  @ApiProperty({
    example: 'GREY',
    description: 'Цвет папки | FolderColors',
  })
  @Prop({ default: FolderColors.GREY, type: String })
  color: FolderColors;

  @ApiProperty({
    example: 8,
    description: 'Вес пустой папки',
  })
  @Prop({ default: 8, type: Number })
  folderSize: number;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
