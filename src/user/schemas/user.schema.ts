/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { UserRoles } from 'src/types';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ example: 'QB_Wheatley', description: 'Ник пользователя' })
  @Prop({ required: true, type: String })
  name: string;

  @ApiProperty({ example: [ 'USER', 'ADMIN' ], description: 'Роли пользователя' })
  @Prop({ default: [UserRoles.USER], type: [String] })
  role: UserRoles[];

  @ApiProperty({ example: 'qb.wheatley@gmail.com', description: 'Email пользователя' })
  @Prop({ required: true, type: String })
  email: string;

  @ApiProperty({ description: 'Захешированный пароль пользователя' })
  @Prop({ required: true, type: String })
  password: string;

  @ApiProperty({ example: false, description: 'Флаг активации аккаунта' })
  @Prop({ default: false, type: Boolean })
  isActivated: boolean;

  @ApiProperty({ description: 'Ссылка для активации акаунта' })
  @Prop({ type: String })
  activationLink: string;

  @ApiProperty({ description: 'Cсылка для сброса пароля' })
  @Prop({ type: String })
  resetPasswordLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
