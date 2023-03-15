import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ChangeSettingsDto {
  @ApiProperty({
    example: true,
    description: 'Флаг isRecommend',
  })
  @IsBoolean({ message: 'Должно быть булеан' })
  readonly isRecommend: boolean;

  @ApiProperty({
    example: true,
    description: 'Флаг isTools',
  })
  @IsBoolean({ message: 'Должно быть булеан' })
  readonly isTools: boolean;
}
