import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVideoDto {
  @ApiProperty({
    example: 'Название видео',
    description: 'Название видео',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: 'Some random description...',
    description: 'Описание трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly description: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;
}
