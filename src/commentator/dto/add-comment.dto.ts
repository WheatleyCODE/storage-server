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
  readonly id: Types.ObjectId;

  @ApiProperty({
    example: 'FOLDER',
    description: 'Тип Элемента хранилища | ItemTypes',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly type: ItemTypes;

  @ApiProperty({
    example: 'Текст',
    description: 'Текст комментария',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID комментария или ничего',
  })
  readonly answerFor: Types.ObjectId | undefined;
}
