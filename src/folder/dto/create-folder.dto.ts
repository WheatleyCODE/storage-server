import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFolderDto {
  @ApiProperty({
    example: 'Новая старая папка',
    description: 'Название папки',
  })
  @IsString({ message: 'Должно быть строкой' })
  @Length(3, 14, { message: 'Не меньше 3 и не больше 14' })
  readonly name: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;
}
