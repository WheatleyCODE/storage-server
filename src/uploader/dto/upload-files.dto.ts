import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class UploadFilesDto {
  @ApiProperty({
    example: '507f191e810c19729de860ea | undefined',
    description: 'ID папки родителя или ничего',
  })
  readonly parent: Types.ObjectId | undefined;
}
