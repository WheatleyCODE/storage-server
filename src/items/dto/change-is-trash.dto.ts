import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean } from 'class-validator';
import { ItemDto } from 'src/types';

export class ChangeIsTrashDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];

  @ApiProperty({
    example: true,
    description: 'Флаг добавления элемента в корзину',
  })
  @IsBoolean({ message: 'Должно быть булеан' })
  readonly isTrash: boolean;
}
