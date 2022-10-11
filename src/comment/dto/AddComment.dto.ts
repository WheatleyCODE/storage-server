import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ItemTypes } from 'src/types';

export class AddCommentDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Элемента хранилища | StorageItems',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly item: Types.ObjectId;

  @ApiProperty({
    example: 'FOLDER',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly itemType: ItemTypes;

  @ApiProperty({
    example: 'Заголовок',
    description: 'Заголовок комментария',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly title: string;

  @ApiProperty({
    example: 'Текст',
    description: 'Текст комментария',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user: Types.ObjectId;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID комментария или ничего',
  })
  readonly answer: Types.ObjectId | undefined;
}
