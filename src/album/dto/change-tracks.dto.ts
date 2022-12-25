import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeTracksDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Альбома',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly album: Types.ObjectId;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'IDs треков',
  })
  @IsArray({ message: 'Должен быть массив' })
  readonly tracks: Types.ObjectId[];

  @ApiProperty({
    example: false,
    description: 'Флаг на удаление',
  })
  @IsBoolean({ message: 'Должен быть булеан' })
  readonly isDelete: boolean;
}
