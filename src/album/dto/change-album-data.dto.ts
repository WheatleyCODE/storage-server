import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeAlbumDataDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Элемента',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly id: Types.ObjectId;
  @ApiProperty({
    example: 'Название...',
    description: 'Название Альбома',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: 'Oxxxymiron',
    description: 'Автор альбома',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly author: string;
}
