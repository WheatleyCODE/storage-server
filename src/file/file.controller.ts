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
import { ValidationPipe } from 'src/pipes';
import { FileTransferData } from 'src/transfer';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { stringToOjbectId } from 'src/utils';
import { UserReq } from 'src/types';
import { JwtAuthGuard } from 'src/guards';

@Controller('/api/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  createFile(
    @UploadedFiles() files: { file: Express.Multer.File[] },
    @Body() dto: CreateFileDto,
    @Req() req: UserReq,
  ): Promise<FileTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.fileService.createFile(dto, id, files.file[0]);
  }
}
