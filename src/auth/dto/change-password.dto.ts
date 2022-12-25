import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 12, { message: 'Не меньше 8 и не больше 12' })
  readonly password: string;

  @IsString({ message: 'Должно быть строкой' })
  readonly resetPasswordLink: string;
}
