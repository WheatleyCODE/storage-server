import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  Req,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackTransferData } from 'src/transfer';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/guards';
import { ValidationPipe } from 'src/pipes';
import { CreateTrackDto } from './dto/create-track-dto';
import { UserReq } from 'src/types';
import { stringToOjbectId } from 'src/utils';
import { ChangeFileDto } from 'src/album/dto/change-file.dto';
import { ChangeTrackDataDto } from './dto/change-track-data.dto';

@Controller('/api/track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  createTrack(
    @UploadedFiles() files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
    @Req() req: UserReq,
  ): Promise<TrackTransferData> {
    const id = stringToOjbectId(req.userTD.id);

    return this.trackService.createTrack(
      dto,
      id,
      files?.audio && files.audio[0],
      files?.image && files.image[0],
    );
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  @Post('/change/image')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  changeImage(
    @UploadedFiles() files: { image?: Express.Multer.File[] },
    @Body() dto: ChangeFileDto,
    @Req() req: UserReq,
  ): Promise<TrackTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.trackService.changeImage(dto, id, files?.image && files.image[0]);
  }

  @UseInterceptors(FileFieldsInterceptor([{ name: 'audio', maxCount: 1 }]))
  @Post('/change/file')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  changeFile(
    @UploadedFiles() files: { audio?: Express.Multer.File[] },
    @Body() dto: ChangeFileDto,
    @Req() req: UserReq,
  ): Promise<TrackTransferData> {
    const id = stringToOjbectId(req.userTD.id);
    return this.trackService.changeFile(dto, id, files?.audio && files.audio[0]);
  }

  @Post('/change/data')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  changeData(@Body() dto: ChangeTrackDataDto): Promise<TrackTransferData> {
    return this.trackService.changeData(dto);
  }
}
