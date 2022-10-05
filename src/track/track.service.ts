import { CreateTrackOptions, TrackTransferData } from './../types/track';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async delete(id: Types.ObjectId): Promise<TrackDocument & DeleteItems> {
    try {
      const deletedTrack = await this.trackModel.findByIdAndDelete(id);
      await this.filesService.removeFile(deletedTrack.audio);
      await this.filesService.removeFile(deletedTrack.image);

      const deleteItems = {
        deleteCount: 1,
        deleteItems: [deletedTrack._id],
      };

      return Object.assign(deletedTrack, deleteItems);
    } catch (e) {
      throw e;
    }
  }

  async changeImage(id: Types.ObjectId): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  async changeAudio(id: Types.ObjectId): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  async download(id: Types.ObjectId, type: ItemTypes): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  async copy(id: Types.ObjectId, type: ItemTypes): Promise<TrackDocument> {
    throw new Error('Method not implemented.');
  }

  async getAllToDto(pag: Pagination): Promise<TrackTransferData[]> {
    throw new Error('Method not implemented.');
  }

  async getOneByIdToDto(correctId: any): Promise<TrackTransferData> {
    throw new Error('Method not implemented.');
  }

  async deleteByIds(ids: Types.ObjectId[]): Promise<TrackDocument[]> {
    try {
      const deletedTracks: TrackDocument[] = [];

      for await (const id of ids) {
        const deleteTrack = await this.delete(id);
        deleteTrack.deleteCount = undefined;
        deleteTrack.deleteItems = undefined;

        deletedTracks.push(deleteTrack);
      }

      return deletedTracks;
    } catch (e) {
      throw new HttpException(
        'Ошибка при удалении треков по IDS',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
