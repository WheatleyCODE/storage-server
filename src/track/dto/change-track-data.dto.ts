import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeTrackDataDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Элемента',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly id: Types.ObjectId;

  @ApiProperty({
    example: 'Сделано в России',
    description: 'Название трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: 'Oxxxymiron',
    description: 'Автор трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly author: string;

  @ApiProperty({
    example: 'Some random text...',
    description: 'Текст трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;
}
