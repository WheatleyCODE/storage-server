import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ItemDto } from 'src/types';

export class CopyItemDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];
}
