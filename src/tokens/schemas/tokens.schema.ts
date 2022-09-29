import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type TokensDocument = Tokens & Document;

@Schema()
export class Tokens {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cC...',
    description: 'Токен доступа',
  })
  @Prop({ type: String, required: true })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cC...',
    description: 'Токен обновления доступа',
  })
  @Prop({ type: String, required: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
