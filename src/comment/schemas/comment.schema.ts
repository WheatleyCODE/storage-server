import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {
  @ApiProperty({ example: 'Новый комментарий', description: 'Заголовок комментария' })
  @Prop({ required: true, type: String })
  title: string;

  @ApiProperty({ example: 'Текст комментария', description: 'Очень важное мнение' })
  @Prop({ required: true, type: String })
  text: string;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Пользователя',
  })
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @ApiProperty({
    example: '507f191e810c19729de860ea',
    description: 'ID Комментария',
  })
  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  answer: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
