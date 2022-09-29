import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { UserRoles } from 'src/types';

export class ChangeRoleDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @IsString({ message: 'Должно быть строкой' })
  readonly user: Types.ObjectId;

  @ApiProperty({ example: '[USER, ADMIN]', description: 'Роли пользователя' })
  @IsArray()
  readonly role: UserRoles[];
}
