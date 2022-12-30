import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';
import { DefaultSchema } from 'src/core';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends DefaultSchema {
  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({ example: 'Новый комментарий', description: 'Заголовок комментария' })
  @Prop({ required: true, type: String })
  title: string;

  @ApiProperty({ example: 'Текст комментария', description: 'Очень важное мнение' })
  @Prop({ required: true, type: String })
  text: string;

  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'IDs Комментариев',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Comment' })
  answers: Types.ObjectId[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
