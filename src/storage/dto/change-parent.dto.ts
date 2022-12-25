import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { ItemDto } from 'src/types';

export class ChangeParentDto {
  @ApiProperty({
    example: '[{ id: "507f191e810c19729de860ea", type: "FOLDER"}]',
    description: 'Массив ItemDto[]',
  })
  @IsArray({ message: 'Должен быть массив' })
  items: ItemDto[];

  @ApiProperty({
    example: '507f191e810c19729de860ea | null',
    description: 'ID Папки или null',
  })
  readonly parent: Types.ObjectId | null;
}
