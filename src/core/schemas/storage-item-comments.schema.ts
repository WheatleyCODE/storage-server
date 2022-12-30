import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { StorageItemSchema } from './storage-item.schema';

export class StorageItemCommentsSchema extends StorageItemSchema {
  @ApiProperty({
    example: '[507f191e810c19729de860ea]',
    description: 'IDs Комментариев',
  })
  @Prop({ type: [Types.ObjectId], ref: 'Comment' })
  comments: Types.ObjectId[];
}
