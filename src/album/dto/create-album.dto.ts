import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAlbumDto {
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

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;
}
