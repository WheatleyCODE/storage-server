import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchItemDto {
  @ApiProperty({
    example: 'Новая папк...',
    description: 'Текст по которому пользователь ищет в поиске',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;
}
