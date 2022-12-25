import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Некорректная почта' })
  readonly email: string;
}
