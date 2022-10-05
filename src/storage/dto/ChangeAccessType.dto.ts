import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { AccessTypes, ItemTypes } from 'src/types';

export class ChangeAccessTypeDto {
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
    example: 'PUBLIC',
    description: 'Тип Доступа к элементу хранилища | AccessTypes',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly accessType: AccessTypes;
}
