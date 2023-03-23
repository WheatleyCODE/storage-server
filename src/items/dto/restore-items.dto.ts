import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { ItemTransferData } from 'src/types';

export class RestoreItemsDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER", ...more }]',
    description: 'Массив ItemTransferData[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemTransferData[];
}
