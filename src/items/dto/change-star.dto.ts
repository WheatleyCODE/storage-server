import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ItemDto } from 'src/types';

export class ChangeStarDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];

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
  readonly isStar: boolean;
}
