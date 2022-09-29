import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateStorageDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user: Types.ObjectId;
}
