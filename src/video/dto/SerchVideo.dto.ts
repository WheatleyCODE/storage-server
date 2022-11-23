import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SearchVideoDto {
  @ApiProperty({
    example: 'Майнкрафт гайд',
    description: 'Текст по которому пользователь ищет в поиске',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly text: string;
}
