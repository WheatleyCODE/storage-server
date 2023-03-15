import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeVideoDataDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Элемента',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly id: Types.ObjectId;
  @ApiProperty({
    example: 'Название...',
    description: 'Название Видео',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: 'Some random description...',
    description: 'Описание трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;
}
