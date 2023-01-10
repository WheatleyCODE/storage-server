import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class RegistrationDto {
  @ApiProperty({ example: 'Alex2001RUS', description: 'Ник' })
  @Length(3, 20, { message: 'Не меньше 3 и не больше 20' })
  readonly name: string;

  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректная почта' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @Length(8, 20, { message: 'Не меньше 8 и не больше 20' })
  readonly password: string;
}
