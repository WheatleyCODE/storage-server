import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ChangeTrackFilesDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Стораджа',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly storage: Types.ObjectId;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Трека',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly track: Types.ObjectId;
}
