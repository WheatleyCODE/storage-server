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
import { ItemTransferData, UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { UploadFilesDto } from './dto/upload-files.dto';
import { UploaderService } from './uploader.service';

@Controller('/api/uploader')
export class UploaderController {
  constructor(private readonly uploaderService: UploaderService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'files' }]))
  @Post('/files')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  uploadFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() dto: UploadFilesDto,
    @Req() req: UserReq,
  ): Promise<ItemTransferData[]> {
    const id = stringToOjbectId(req.userTD.id);
    return this.uploaderService.uploadFiles(dto, id, files.files);
  }
}
