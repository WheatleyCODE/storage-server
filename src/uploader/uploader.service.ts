import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { FileService } from 'src/file/file.service';
import { ImageService } from 'src/image/image.service';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { FileTransferData, TrackTransferData, VideoTransferData } from 'src/transfer';
import { ImageTransferData } from 'src/transfer/image.transfer-data';
import { ItemTransferData, IUploaderService } from 'src/types';
import { VideoService } from 'src/video/video.service';
import { UploadFilesDto } from './dto/upload-files.dto';

@Injectable()
export class UploaderService implements IUploaderService {
  private readonly fileExts = {
    image: ['jpg', 'png', 'jpeg'],
    audio: ['mp3'],
    video: ['mp4'],
  };

  constructor(
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
    private readonly storageService: StorageService,
  ) {}

  async uploadFiles(
    dto: UploadFilesDto,
    user: Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<ItemTransferData[]> {
    try {
      const { parent } = dto;
      const strg = await this.storageService.getOneByAndCheck({ user });

      if (!strg) {
        throw new HttpException('Хранилище не найдено', HttpStatus.BAD_REQUEST);
      }

      const itemsTransferData: ItemTransferData[] = [];

      const isIncludes = (searchArr: string[], arrStr: string[]): boolean => {
        return searchArr.includes(arrStr[arrStr.length - 1]);
      };

      for await (const file of files) {
        const filename = file.originalname.split('.');
        const name = filename[0];

        if (isIncludes(this.fileExts.audio, filename)) {
          const track = await this.createTrack(name, user, file, parent);
          itemsTransferData.push(track);
          continue;
        }

        if (isIncludes(this.fileExts.image, filename)) {
          const image = await this.createImage(name, user, file, parent);
          itemsTransferData.push(image);
          continue;
        }

        if (isIncludes(this.fileExts.video, filename)) {
          const video = await this.createVideo(name, user, file, parent);
          itemsTransferData.push(video);
          continue;
        }

        const fileTD = await this.createFile(name, user, file, parent);
        itemsTransferData.push(fileTD);
      }

      return itemsTransferData;
    } catch (e) {
      throw e;
    }
  }

  private async createTrack(
    name: string,
    user: Types.ObjectId,
    file: Express.Multer.File,
    parent?: Types.ObjectId,
  ): Promise<TrackTransferData> {
    return await this.trackService.createTrack(
      {
        name,
        author: 'Без автора',
        parent,
      },
      user,
      file,
    );
  }

  private async createImage(
    name: string,
    user: Types.ObjectId,
    file: Express.Multer.File,
    parent?: Types.ObjectId,
  ): Promise<ImageTransferData> {
    return await this.imageService.createImage(
      {
        name,
        parent,
      },
      user,
      file,
    );
  }

  private async createVideo(
    name: string,
    user: Types.ObjectId,
    file: Express.Multer.File,
    parent?: Types.ObjectId,
  ): Promise<VideoTransferData> {
    return await this.videoService.createVideo({ name, parent }, user, file);
  }

  private async createFile(
    name: string,
    user: Types.ObjectId,
    file: Express.Multer.File,
    parent?: Types.ObjectId,
  ): Promise<FileTransferData> {
    return await this.fileService.createFile({ name, parent }, user, file);
  }
}
