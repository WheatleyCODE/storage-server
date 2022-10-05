import { CreateTrackOptions, TrackTransferData } from './../types/track';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Types } from 'mongoose';
import { ITrackService } from 'src/core/Interfaces/ITrackService';
import { FilesService, FileType } from 'src/files/files.service';
import { DeleteItems, ItemTypes, Pagination, UpdateTrackOptions } from 'src/types';
import { Track, TrackDocument } from './schemas/track.schema';

@Injectable()
export class TrackService extends ITrackService<TrackDocument, UpdateTrackOptions> {
  constructor(
    @InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
    private readonly filesService: FilesService,
  ) {
    super(trackModel);
  }

  async create(options: CreateTrackOptions): Promise<TrackDocument> {
    try {
      const pathImage = await this.filesService.createFile(FileType.IMAGE, options.image);
      const pathAudio = await this.filesService.createFile(FileType.AUDIO, options.audio);

      return await this.trackModel.create({
        ...options,
        audio: pathAudio,
        image: pathImage,
      });
    } catch (e) {
      throw e;
    }
  }

  changeImage(id: Types.ObjectId): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  changeAudio(id: Types.ObjectId): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  download(id: Types.ObjectId, type: ItemTypes): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  copy(id: Types.ObjectId, type: ItemTypes): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  delete(id: Types.ObjectId): Promise<Track & Document<any, any, any> & DeleteItems> {
    throw new Error('Method not implemented.');
  }

  async getAllToDto(pag: Pagination): Promise<TrackTransferData[]> {
    throw new Error('Method not implemented.');
  }

  async getOneByIdToDto(correctId: any): Promise<TrackTransferData> {
    throw new Error('Method not implemented.');
  }
}
