import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTrackDto {
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

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID альбома или ничего',
  })
  readonly album: Types.ObjectId | undefined;
}
