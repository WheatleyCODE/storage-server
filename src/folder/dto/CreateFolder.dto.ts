import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFolderDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Хранилища',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly storage: Types.ObjectId;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user: Types.ObjectId;

  @IsString({ message: 'Должно быть строкой' })
  readonly name: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;
}
