import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ example: 'Alex2001RUS', description: 'Ник' })
  @Length(6, 14, { message: 'Не меньше 6 и не больше 14' })
  readonly name: string;

  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректная почта' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 12, { message: 'Не меньше 8 и не больше 12' })
  readonly password: string;
}
