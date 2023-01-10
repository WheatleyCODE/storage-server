import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { DefaultSchema } from './default.schema';
import { AccessTypes, ItemTypes } from 'src/types';

export class StorageItemSchema extends DefaultSchema {
  @ApiProperty({
    example: 'Новая папка 2',
    description: 'Название элемента хранилища',
  })
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty({
    example: 'FOLDER',
    description: 'Тип  элемента хранилища | ItemTypes',
  })
  @Prop({ required: true, type: String })
  type: ItemTypes;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Папки родителя',
  })
  @Prop({ type: Types.ObjectId, ref: 'Folder' })
  parent: Types.ObjectId;

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
    example: 1235,
    description: 'Количество звезд',
  })
  @Prop({ default: 0, type: Number })
  starredCount: number;

  // ! Fix
  @ApiProperty({
    example: 'http://localhost:3000/share/folder/somerandomtext',
    description: 'Ссылка доступа к элементу хранилища',
  })
  @Prop({ type: String })
  accessLink: string;

  @ApiProperty({
    example: 'PUBLIC',
    description: 'Тип Доступа к элементу хранилища | AccessTypes',
  })
  @Prop({ default: AccessTypes.PRIVATE, type: String })
  accessType: AccessTypes;

  @ApiProperty({
    example: '123456789012345',
    description: 'Дата последнего открытия элемента хранилища',
  })
  @Prop({ required: true, type: Number })
  openDate: number;
}
