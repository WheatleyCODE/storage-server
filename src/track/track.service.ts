import { CreateTrackOptions, TrackTransferData } from './../types/track';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ITrackService } from 'src/core/Interfaces/ITrackService';
import { FilesService, FileType } from 'src/files/files.service';
import { AccessTypes, DeleteItems, Pagination, UpdateTrackOptions } from 'src/types';
import { Track, TrackDocument } from './schemas/track.schema';
import { ReadStream } from 'fs';

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

  async searchPublicTracks(text: string, pag?: Pagination): Promise<TrackTransferData[]> {
    try {
      if (pag) {
        const tracks = await this.trackModel.find({ name: text }).skip(pag.offset).limit(pag.count);
        return tracks.map((track) => new TrackTransferData(track));
      }

      const tracks = await this.trackModel.find({ name: text });
      return tracks.map((track) => new TrackTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске треков', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changeFile(
    id: Types.ObjectId,
    file: Express.Multer.File,
    fileType: FileType,
  ): Promise<TrackDocument> {
    try {
      const track = await this.findByIdAndCheck(id);

      if (!track[fileType])
        throw new HttpException('Ошибка при изменении файла', HttpStatus.BAD_REQUEST);

      const newPath = await this.filesService.changeFile(fileType, file, track[fileType]);
      track[fileType] = newPath;
      return track.save();
    } catch (e) {
      throw e;
    }
  }

  async copy(id: Types.ObjectId): Promise<TrackDocument> {
    try {
      const track = await this.findByIdAndCheck(id);
      const { user, name, author, isTrash, text } = track;

      const imageNewPath = await this.filesService.copyFile(track.image, FileType.IMAGE);
      const audioNewPath = await this.filesService.copyFile(track.audio, FileType.AUDIO);

      return await this.trackModel.create({
        user,
        name: `${name} copy`,
        author,
        text,
        isTrash,
        audio: imageNewPath,
        image: audioNewPath,
        creationDate: Date.now(),
        openDate: Date.now(),
      });
    } catch (e) {
      throw e;
    }
  }

  async download(id: Types.ObjectId): Promise<ReadStream> {
    try {
      const track = await this.findByIdAndCheck(id);
      const file = await this.filesService.download(track.audio);
      return file;
    } catch (e) {
      throw e;
    }
  }

  async getAllPublicTracks(pag?: Pagination): Promise<TrackTransferData[]> {
    try {
      if (pag) {
        const tracks = await this.trackModel
          .find({ type: AccessTypes.PUBLIC })
          .skip(pag.offset)
          .limit(pag.count);

        return tracks.map((track) => new TrackTransferData(track));
      }

      const tracks = await this.trackModel.find({ type: AccessTypes.PUBLIC });

      return tracks.map((track) => new TrackTransferData(track));
    } catch (e) {
      throw new HttpException('Ошибка при поиске треков', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
