import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ItemFileTypes } from 'src/types';

export class CopyFileDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Хранилища',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly storage: Types.ObjectId;

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
  readonly itemType: ItemFileTypes;
}
