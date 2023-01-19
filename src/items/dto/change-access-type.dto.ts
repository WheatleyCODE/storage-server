import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { AccessTypes, ItemDto } from 'src/types';

export class ChangeAccessTypeDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];

  @ApiProperty({
    example: 'PUBLIC',
    description: 'Тип Доступа к элементу хранилища | AccessTypes',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly accessType: AccessTypes;
}
