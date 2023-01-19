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

  // @UseInterceptors(
  //   FileFieldsInterceptor([
  //     { name: 'image', maxCount: 1 },
  //     { name: 'audio', maxCount: 1 },
  //   ]),
  // )
  // @Post('/change/track/files')
  // createTrackTest(
  //   @UploadedFiles() files: { image?: Express.Multer.File[]; audio?: Express.Multer.File[] },
  //   @Body() dto: ChangeTrackFilesDto,
  // ): Promise<TrackTransferData> {
  //   return this.storageService.changeTrackFiles(
  //     dto,
  //     files?.audio && files.audio[0],
  //     files?.image && files.image[0],
  //   );
  // }
}
