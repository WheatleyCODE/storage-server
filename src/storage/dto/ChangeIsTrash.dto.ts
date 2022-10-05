import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ItemTypes } from 'src/types';

export class ChangeIsTrashDto {
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
    example: true,
    description: 'Флаг добавления элемента в корзину',
  })
  @IsBoolean({ message: 'Должно быть булеан' })
  readonly isTrash: boolean;
}
