import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AlbumService } from 'src/album/album.service';
import { FileService } from 'src/file/file.service';
import { FilesService } from 'src/files/files.service';
import { ImageService } from 'src/image/image.service';
import { StorageService } from 'src/storage/storage.service';
import { TrackService } from 'src/track/track.service';
import { IFinderService, ItemTransferData } from 'src/types';
import { VideoService } from 'src/video/video.service';

@Injectable()
export class FinderService implements IFinderService {
  constructor(
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
    private readonly imageService: ImageService,
    private readonly videoService: VideoService,
    private readonly storageService: StorageService,
  ) {}

  searchPublicItems(text: string, count: number, offset: number): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }
  getAllPublicItems(count: number, offset: number): Promise<ItemTransferData[]> {
    throw new Error('Method not implemented.');
  }
}
