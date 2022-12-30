import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

// ! Придумать как бы оно изменялось без кодинга
export class DefaultSchema {
  @ApiProperty({
    example: 123456789012345,
    description: 'Дата создания элемента',
  })
  @Prop({ required: true, type: Number })
  createDate: number;

  @ApiProperty({
    example: 123456789012345,
    description: 'Дата последнего изменения элемента',
  })
  @Prop({ required: true, type: Number })
  changeDate: number;
}
