import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateImageDto {
  @ApiProperty({
    example: 'Новая картика',
    description: 'Название картинки',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent?: Types.ObjectId;
}
