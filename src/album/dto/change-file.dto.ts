import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeFileDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Элемента',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly id: Types.ObjectId;
}
