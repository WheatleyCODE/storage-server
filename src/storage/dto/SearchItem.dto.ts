import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SearchItemDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Стораджа',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly storage: Types.ObjectId;

  @ApiProperty({
    example: 'Новая папк...',
    description: 'Текст по которому пользователь ищет в поиске',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;
}
