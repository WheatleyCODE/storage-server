import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ItemTypes } from 'src/types';

export class ChangeLikeDto {
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
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user: Types.ObjectId;

  @ApiProperty({
    example: true,
    description: 'Флаг добавить или удалить',
  })
  @IsBoolean({ message: 'Должно быть булеан' })
  readonly isLike: boolean;
}
