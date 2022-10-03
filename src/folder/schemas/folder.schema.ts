import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { AccessTypes, FolderColors, ItemTypes } from 'src/types';

export type FolderDocument = Folder & Document;

@Schema()
export class Folder {
  @ApiProperty({
    example: 'FOLDER',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @Prop({ default: ItemTypes.FOLDER, type: String })
  type: ItemTypes;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    example: 'Новая папка 2',
    description: 'Название элемента хранилища',
  })
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Папки родителя',
  })
  @Prop({ type: Types.ObjectId, ref: 'Folder' })
  parent: Types.ObjectId;

  @ApiProperty({
    example: 'GREY',
    description: 'Цвет папки | FolderColors',
  })
  @Prop({ default: FolderColors.GREY, type: String })
  color: FolderColors;

  @ApiProperty({
    example: false,
    description: 'Флаг добавления элемента в корзину',
  })
  @Prop({ default: false, type: Boolean })
  isTrash: boolean;

  @ApiProperty({
    example: 1235,
    description: 'Количество лайков',
  })
  @Prop({ default: 0, type: Number })
  likeCount: number;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'ID Массив лайнувших пользователей',
  })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  likedUsers: Types.ObjectId[];

  @ApiProperty({
    example: 1235,
    description: 'Количество прослушиваний',
  })
  @Prop({ default: 0, type: Number })
  listenCount: number;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'ID Массив просмотревших пользователей пользователей',
  })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  listenedUsers: Types.ObjectId[];

  @ApiProperty({
    example: 1235,
    description: 'Количество звезд',
  })
  @Prop({ default: 0, type: Number })
  starredCount: number;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'ID Массив starred пользователей',
  })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  starredUser: Types.ObjectId[];

  @ApiProperty({
    example: 'http://localhost:3000/share/folder/somerandomtext',
    description: 'Ссылка доступа к элементу хранилища',
  })
  @Prop({ type: String })
  accesLink: string;

  @ApiProperty({
    example: 'PUBLIC',
    description: 'Тип Доступа к элементу хранилища | AccessTypes',
  })
  @Prop({ default: AccessTypes.PRIVATE, type: String })
  accessType: AccessTypes;

  @ApiProperty({
    example: '123456789012345',
    description: 'Дата создания элемента хранилища',
  })
  @Prop({ required: true, type: Number })
  creationDate: number;

  @ApiProperty({
    example: '123456789012345',
    description: 'Дата последнего открытия элемента хранилища',
  })
  @Prop({ required: true, type: Number })
  openDate: number;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
