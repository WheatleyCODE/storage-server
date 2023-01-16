import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { ImageTransferData } from 'src/transfer/image.transfer-data';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { stringToOjbectId } from 'src/utils';
import { UserReq } from 'src/types';

@Controller('/api/image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  createFile(
    @UploadedFiles() files: { image: Express.Multer.File[] },
    @Body() dto: CreateImageDto,
    @Req() req: UserReq,
  ): Promise<ImageTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.imageService.createImage(dto, id, files.image[0]);
  }
}
