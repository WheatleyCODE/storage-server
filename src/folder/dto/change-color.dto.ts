import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { ItemDto, FolderColors } from 'src/types';

export class ChangeColorDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];

  @ApiProperty({
    example: 'GREY',
    description: 'Цвет папки FolderColors',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly color: FolderColors;
}
