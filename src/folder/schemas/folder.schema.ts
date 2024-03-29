import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { StorageItemCommentsSchema } from 'src/core';
import { FolderColors } from 'src/types';

export type FolderDocument = Folder & Document;

@Schema()
export class Folder extends StorageItemCommentsSchema {
  @ApiProperty({
    example: 'GREY',
    description: 'Цвет папки | FolderColors',
  })
  @Prop({ default: FolderColors.GREY, type: String })
  color: FolderColors;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
